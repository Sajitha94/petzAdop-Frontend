import { API_BASE_URL } from "./config";

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return { ok: response.ok, data };
  } catch (error) {
    console.error("API request error:", error);
    return { ok: false, data: { message: "Network error" } };
  }
};
