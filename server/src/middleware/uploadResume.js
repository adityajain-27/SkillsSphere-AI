import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDirectory = path.join(process.cwd(), "src", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "").replace(/\s+/g, "-");
    const uniqueName = `${Date.now()}-${name}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];
const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const hasAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
  const hasAllowedExtension = allowedExtensions.includes(extension);

  if (hasAllowedMimeType && hasAllowedExtension) {
    cb(null, true);
  } else {
    const typeError = new Error("Only PDF, DOCX, and TXT files are allowed");
    typeError.code = "INVALID_FILE_TYPE";
    cb(typeError, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadResumeMiddleware = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size must be less than or equal to 5 MB",
        });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid form field name. Use `resume` as the file field key in form-data.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Invalid file upload request",
      });
    }

    if (error?.code === "INVALID_FILE_TYPE") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload resume",
      });
    }

    return next();
  });
};

