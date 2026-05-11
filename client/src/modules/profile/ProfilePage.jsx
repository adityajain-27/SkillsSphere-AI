import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Pencil,
  X,
  Check,
  ChevronLeft,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import ProfileField from "./components/ProfileField";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, logout } from "../../features/auth/authSlice";
import { updateProfile, deleteProfile } from "./services/profileService";
import LoadingState from "../../shared/components/LoadingState";

const ROLE_LABELS = {
  student: "Student",
  tutor: "Tutor",
  recruiter: "Recruiter",
};

const ROLE_COLORS = {
  student:
    "bg-brand-600/20 text-brand-300 border border-brand-500/30",
  tutor:
    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  recruiter:
    "bg-violet-500/20 text-violet-300 border border-violet-500/30",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "" });
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleEditClick = () => {
    setFormData({ name: user?.name || "" });
    setErrors({});
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "" });
    setErrors({});
    setApiError("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Name cannot be empty";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setApiError("");
      const response = await updateProfile({ name: formData.name.trim() }, token);
      dispatch(updateUserProfile(response.user));
      
      setSaveSuccess(true);
      setIsEditing(false);
      setErrors({});

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setApiError(err.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you absolutely sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteProfile(token);
        dispatch(logout());
        navigate("/login");
      } catch (err) {
        alert(err.message || "Failed to delete account");
        setIsDeleting(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f172a,#020617)] flex items-center justify-center">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  const verificationBadge = user.isEmailVerified ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
      <BadgeCheck size={13} />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
      <AlertCircle size={13} />
      Not Verified
    </span>
  );

  const roleBadge = (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        ROLE_COLORS[user.role] ?? ROLE_COLORS.student
      }`}
    >
      {ROLE_LABELS[user.role] ?? user.role}
    </span>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-[radial-gradient(circle_at_top_left,#0f172a,#020617)] overflow-hidden relative p-5 box-border">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-[120px] -top-[150px] -left-[150px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/40 rounded-full blur-[120px] -bottom-[120px] -right-[120px] -z-10 animate-pulse pointer-events-none" />

      {/* Back navigation */}
      <div className="relative z-10 w-full max-w-2xl pt-6 mb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Page title for accessibility */}
      <h1 className="sr-only">My Profile</h1>

      <div className="relative z-10 w-full max-w-2xl animate-[fadeIn_0.6s_ease]">
        {/* Header card */}
        <div className="mb-5 p-6 rounded-[20px] backdrop-blur-[20px] bg-slate-900/70 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] flex-shrink-0 select-none overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name || "")
              )}
            </div>

            {/* Name + role */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1 font-heading">
                {user.name}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {roleBadge}
                {verificationBadge}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {!isEditing ? (
                <Button
                  id="profile-edit-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  leftIcon={<Pencil size={14} />}
                  className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800/50"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    id="profile-save-btn"
                    size="sm"
                    onClick={handleSave}
                    leftIcon={<Check size={14} />}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white hover:opacity-90"
                  >
                    Save
                  </Button>
                  <Button
                    id="profile-cancel-btn"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    leftIcon={<X size={14} />}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {apiError && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{apiError}</p>
            </div>
          )}

          {/* Save success toast */}
          {saveSuccess && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              <BadgeCheck size={16} />
              Profile updated successfully!
            </div>
          )}
        </div>

        {/* Basic Information card */}
        <div className="mb-5 p-6 rounded-[20px] backdrop-blur-[20px] bg-slate-900/70 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Basic Information
          </h2>

          {isEditing ? (
            <form id="profile-edit-form" onSubmit={handleSave} noValidate>
              <div className="flex flex-col gap-4">
                {/* Editable: Name */}
                <Input
                  id="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  leftIcon={<User size={16} />}
                />

                {/* Non-editable: Email */}
                <Input
                  id="email-display"
                  label="Email"
                  type="email"
                  value={user.email}
                  disabled
                  leftIcon={<Mail size={16} />}
                  helperText="Email cannot be changed here."
                />

                {/* Non-editable: Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300 select-none">
                    Role
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-500 text-sm cursor-not-allowed">
                    <Shield size={16} className="text-slate-500 flex-shrink-0" />
                    <span>{ROLE_LABELS[user.role]}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Role is assigned at registration and cannot be changed.
                  </p>
                </div>

                {/* Non-editable: Verification status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300 select-none">
                    Email Verification Status
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50">
                    {verificationBadge}
                    {!user.isEmailVerified && (
                      <Link
                        to="/verify-email"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Verify Email →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <ProfileField
                label="Full Name"
                value={user.name}
                icon={<User size={16} />}
              />
              <ProfileField
                label="Email"
                value={user.email}
                icon={<Mail size={16} />}
              />
              <ProfileField
                label="Role"
                value={roleBadge}
                icon={<Shield size={16} />}
              />
              <ProfileField
                label="Email Verification Status"
                value={
                  <div className="flex items-center gap-3 flex-wrap">
                    {verificationBadge}
                    {!user.isEmailVerified && (
                      <Link
                        to="/verify-email"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        Verify Email →
                      </Link>
                    )}
                  </div>
                }
                icon={<BadgeCheck size={16} />}
              />
            </div>
          )}
        </div>

        {/* Account Metadata card */}
        <div className="mb-8 p-6 rounded-[20px] backdrop-blur-[20px] bg-slate-900/70 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Account Metadata
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            These fields are read-only and managed by the system.
          </p>

          <ProfileField
            label="Account Created At"
            value={formatDate(user.createdAt)}
            icon={<Calendar size={16} />}
          />
          {user.updatedAt && (
            <ProfileField
              label="Last Updated"
              value={formatDate(user.updatedAt)}
              icon={<Clock size={16} />}
            />
          )}
        </div>

        {/* Danger Zone */}
        <div className="mb-8 p-6 rounded-[20px] backdrop-blur-[20px] bg-red-950/20 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            loading={isDeleting}
            className="w-full sm:w-auto"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
