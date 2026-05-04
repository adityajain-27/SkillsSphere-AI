import { apiRequest } from "../../../services/apiClient";

/**
 * Fetch jobs with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - API response
 */
export const getJobs = async (filters = {}, token) => {
  const queryParams = new URLSearchParams();
  
  if (filters.designation) queryParams.append("designation", filters.designation);
  if (filters.minSalary) queryParams.append("minSalary", filters.minSalary);
  if (filters.maxSalary) queryParams.append("maxSalary", filters.maxSalary);
  if (filters.postedWithin) queryParams.append("postedWithin", filters.postedWithin);

  const queryString = queryParams.toString();
  const path = `/api/jobs${queryString ? `?${queryString}` : ""}`;

  return apiRequest(path, { token });
};
