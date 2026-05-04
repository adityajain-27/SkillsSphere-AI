import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import AnalysisHistory from "../../database/models/AnalysisHistory.js";

export const getHistory = asyncHandler(async (req, res, next) => {
  const history = await AnalysisHistory.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Analysis history fetched successfully",
    data: history,
  });
});
