import axios from "axios";

const apiUrl = process.env.API_URL;

const API = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});


/**
 * Request Interceptor:
 * - Logs the request
 * - Adds the authentication token for protected endpoints
 * - Skips authentication for public endpoints
 */
API.interceptors.request.use(async (config) => {
  try {

    // const publicEndpoints = [
    //   "/room",
    //   "/join",
    //   "/create",
    // ];

    // const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    //   config.url?.includes(endpoint),
    // );

    // if (!isPublicEndpoint) {
    //   const token = await GetToken("accessToken");
    //   if (token) {
    //     console.log(
    //       `🟢 Using access token (first 10 chars): ${token.substring(0, 10)}...`,
    //     );
    //     config.headers.Authorization = `Bearer ${token}`;
    //   } else {
    //     console.log("⚠️ No access token available for request");
    //   }
    // } else {
    //   console.log("🟢 Public endpoint, skipping auth token");
    // }

    return config;
  } catch (error) {
    console.error("❌ Error in request interceptor:", error);
    return config;
  }
});

/**
 * Response Interceptor:
 * - Logs responses
 * - Handles 401 Unauthorized errors by attempting to refresh the token
 * - Retries the original request with the new token if refresh succeeds
 */
API.interceptors.response.use(
  (response) => {
    console.log(
      `🟢 Response from ${response.config.url}: Status ${response.status}`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      `❌ Error response from ${originalRequest.url}: Status ${error.response?.status}`,
    );

    // If unauthorized and token has not been refreshed yet, attempt to refresh
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   console.log("🟢 Token expired, attempting refresh...");
    //   originalRequest._retry = true;
    //
    //   const newToken = await refreshAccessToken();
    //   if (newToken) {
    //     console.log("🟢 Token refresh successful, retrying original request");
    //     originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //     return axios(originalRequest);
    //   } else {
    //     console.log("❌ Token refresh failed, cannot retry request");
    //   }
    // }

    return Promise.reject(error);
  },
);

export default API;
