import { apiRequest } from "../../../services/apiClient";

export const analyzeResume = async (file, jobDescription = "") => {
  try {
    if (!file) throw new Error("Please select a resume file first.");

    const formData = new FormData();
    formData.append("resume", file);
    
    if (jobDescription && jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    }

    // Get token from storage
    const TOKEN_KEY = "skillssphere.auth.token";
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

    const response = await apiRequest("/api/resume/analyze", {
      method: "POST",
      body: formData,
      token,
    });

    if (!response || response.success === false) {
      throw new Error(response?.message || "Failed to analyze resume. Please check the file format.");
    }

    return response;
  } catch (error) {
    console.error("[resumeService] Analysis Error:", error);
    throw error; // Let the caller (component) handle the UI toast/state
  }
};
