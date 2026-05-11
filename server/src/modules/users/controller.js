import User from "../../database/models/User.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return next(new AppError("Please provide a valid name (at least 2 characters)", 400));
  }

  // Update user in database
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim() },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

/**
 * @desc    Delete user account completely
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // We could also delete related records here (e.g., resumes, applications, jobs)
  // But for the scope of this issue, we start with deleting the user.
  // A robust implementation might use a pre('remove') hook on the User model.
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
