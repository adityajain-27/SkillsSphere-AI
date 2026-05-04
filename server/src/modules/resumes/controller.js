import path from "path";
import { parseResume } from "../../utils/parseResume.js";
import Resume from "../../database/models/Resume.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { runPipeline } from "../../../../ai-ml/pipeline/runPipeline.js";
import {
  normalizeResumeData,
  normalizePipelineResult,
} from "../../utils/normalizeResumeResponse.js";
import * as resumeService from "./service.js";
import AnalysisHistory from "../../database/models/AnalysisHistory.js";

const defaultDependencies = {
  parseResume,
  upsertResume: (userId, payload) => resumeService.upsertResume(userId, payload),
};


let controllerDependencies = { ...defaultDependencies };

export const setResumeControllerDependencies = (overrides = {}) => {
  controllerDependencies = {
    ...defaultDependencies,
    ...overrides,
  };
};

export const resetResumeControllerDependencies = () => {
  controllerDependencies = { ...defaultDependencies };
};



export const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    file: {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimeType: req.file.mimetype,
    },
  });
});

export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // Parse resume
    const parsedData = await controllerDependencies.parseResume(file.path);

    // Parse job inputs
    const jobSkills = JSON.parse(req.body.jobSkills || "[]");
    const jobDescription = req.body.jobDescription || "";

    // 🧠 RUN PIPELINE (ONLY LOGIC ENTRY)
    const pipelineResult = await runPipeline({
      resumeData: parsedData,
      jobSkills,
      jobDescription,
    });

    // 🔥 Normalize everything
    const safeData = normalizeResumeData(parsedData);
    const safePipeline = normalizePipelineResult(pipelineResult);

    // Save to DB (optional)
    const savedResume = await controllerDependencies.upsertResume(req.user._id, {
      ...safeData,
      ...safePipeline,
      jobSkills,
      jobDescription,
      file: {
        originalName: file.originalname,
        storedName: file.filename,
        path: file.path,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        mimeType: file.mimetype,
      },
    });

    // Save Analysis History
    await AnalysisHistory.create({
      user: req.user._id,
      score: safePipeline.score || 0,
      classification: safePipeline.classification?.level || "Beginner",
      skills: safeData.skills || [],
      missingSkills: safePipeline.skillMatch?.missingSkills || [],
      suggestions: safePipeline.gapAnalysis?.suggestions || [],
    });

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      resumeId: savedResume._id,
      data: safeData,
      ...safePipeline, // 🔥 single source of truth
      file: savedResume.file,
    });
  } catch (error) {
    console.error("Analyze Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getResumeResult = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const resume = await Resume.findById(id).select("-resumeText").lean();


  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  // Ensure the user owns this resume
  if (resume.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You do not have permission to view this resume", 403));
  }

  res.status(200).json({
    success: true,
    message: "Resume fetched successfully",
    data: resume,
  });
});

export const getLatestResume = asyncHandler(async (req, res, next) => {
  const resume = await resumeService.getLatestResume(req.user._id);

  if (!resume) {
    return next(new AppError("No resume found for this user", 404));
  }

  res.status(200).json({
    success: true,
    message: "Latest resume fetched successfully",
    data: resume,
  });
});


