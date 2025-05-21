import API from "./api"

const handleApiResponse = (promise: any) => {
  return promise
    .then((response: any) => {
      console.log(`🟢 API call succeeded with status ${response.status}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    })
    .catch((error: any) => {
      if (error.message === "Network Error") {
        console.log(
          "LOG  ❌ Error response: Network connectivity issue - user is offline",
        );

        return {
          success: false,
          error: { message: "You're offline. Please check your connection." },
          status: 0,
          isOffline: true,
        };
      }

      console.error(`🔴 API call failed: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || { message: error.message },
        status: error.response?.status || 500,
        isOffline: false,
      };
    });
};

const API_VERSION = "v1";

const PROTECTED_BASE = `${API_VERSION}/protected`;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  status?: number;
  error?: any;
}

async function apiRequest<T = any>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  body?: any,
  params?: Record<string, string>,
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const config = params ? { params } : undefined;

  let promise: any;
  switch (method) {
    case "get":
      promise = API.get(url, config);
      break;
    case "post":
      promise = API.post(url, body ? body : undefined, config);
      break;
    case "put":
      promise = API.put(url, body ? body : undefined, config);
      break;
    case "delete":
      promise = API.delete(url, { data: body, ...config });
      break;
  }

  return handleApiResponse(promise);
}


export const roomApi = {
};

export const listingApi = {
  getAll: (userId: string, fields?: string) =>
    apiRequest(
      "get",
      LISTINGS_BASE(userId),
      undefined,
      fields ? { fields } : undefined,
    ),

  generateDescription: (userId: string, data: any) =>
    apiRequest("post", `${LISTINGS_BASE(userId)}/description`, data),

  validateTitle: (userId: string, data: any) =>
    apiRequest("post", `${LISTINGS_BASE(userId)}/validate-title`, data),

  createNewTitle: (userId: string, data: any) =>
    apiRequest("post", `${LISTINGS_BASE(userId)}/new-title`, data),

  getMyListingsPage: (userId: string) =>
    apiRequest("get", MY_LISTINGS_BASE(userId)),

  getMyListingsIDPage: (userId: string, listingId: string) =>
    apiRequest("get", MY_LISTING_BASE(userId, listingId)),

  getOne: (userId: string, listingId: string, fields?: string) =>
    apiRequest(
      "get",
      LISTING_BASE(userId, listingId),
      undefined,
      fields ? { fields } : undefined,
    ),

  create: (userId: string, data: any) =>
    apiRequest("post", LISTINGS_BASE(userId), data),

  update: (userId: string, listingId: string, data: any) =>
    apiRequest("put", LISTING_BASE(userId, listingId), data),

  updateMany: (userId: string, data: any) =>
    apiRequest("put", LISTINGS_BASE(userId), data),

  delete: (userId: string, listingId: string) =>
    apiRequest("delete", LISTING_BASE(userId, listingId)),

  deleteMany: (userId: string, data: any) =>
    apiRequest("delete", LISTINGS_BASE(userId), data),
};
