import { apiRequest, normalizeApiError } from "../../../services/apiClient";

/**
 * Handle API errors consistently for profile service
 */
const handleProfileError = (error) => {
  const normalized = normalizeApiError(error);

  if (normalized.status === 401 || normalized.status === 403) {
    return {
      ...normalized,
      message: "You are not authorized. Please log in again.",
    };
  }

  if (normalized.status === 400 || normalized.status === 422) {
    return {
      ...normalized,
      message: normalized.message || "Please check your input and try again.",
    };
  }

  if (normalized.status === 0 || normalized.status >= 500) {
    return {
      ...normalized,
      message: "Unable to connect to the server. Please try again later.",
    };
  }

  return normalized;
};

/**
 * Update user profile details
 * @param {Object} payload - Profile update data (e.g., { name })
 * @param {string} token - Auth bearer token
 * @returns {Promise<{success: boolean, user: Object}>}
 */
export const updateProfile = async (payload, token) => {
  try {
    const response = await apiRequest("/api/users/me", {
      method: "PUT",
      body: payload,
      token,
    });
    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    throw handleProfileError(error);
  }
};

/**
 * Delete user account
 * @param {string} token - Auth bearer token
 * @returns {Promise<{success: boolean}>}
 */
export const deleteProfile = async (token) => {
  try {
    const response = await apiRequest("/api/users/me", {
      method: "DELETE",
      token,
    });
    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    throw handleProfileError(error);
  }
};
