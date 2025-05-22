import API from "./api";

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

const ROOMS_BASE = `/${API_VERSION}/rooms`;
const ROOM = (code: string) => `${ROOMS_BASE}/${code}`;

const ROOM_PLAYERS = (code: string) => `${ROOM(code)}/players`;
const ROOM_PLAYER = (code: string, playerId: string) =>
  `${ROOM_PLAYERS(code)}/${playerId}`;

const PLAYER_PROPERTIES = (code: string, playerId: string) =>
  `${ROOM_PLAYER(code, playerId)}/properties`;
const PLAYER_PROPERTY = (code: string, playerId: string, propertyId: string) =>
  `${PLAYER_PROPERTIES(code, playerId)}/${propertyId}`;

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
  create: (data: any) => apiRequest("post", ROOMS_BASE, data),
  getPlayers: (code: string) => apiRequest("get", ROOM_PLAYERS(code)),
  getProperties: (code: string) =>
    apiRequest("get", `${ROOM(code)}/properties`),
  checkExistingRoom: (code: string) =>
    apiRequest("get", `${ROOM(code)}/exists`),
};

export const playerApi = {
  join: (code: string, data: any) =>
    apiRequest("post", ROOM_PLAYERS(code), data),

  getDetails: (code: string, playerId: string) =>
    apiRequest("get", ROOM_PLAYER(code, playerId)),

  addProperty: (code: string, playerId: string, propertyId: string) =>
    apiRequest("post", PLAYER_PROPERTY(code, playerId, propertyId)),

  removeProperty: (code: string, playerId: string, propertyId: string) =>
    apiRequest("delete", PLAYER_PROPERTY(code, playerId, propertyId)),

  mortgageProperty: (code: string, playerId: string, propertyId: string) =>
    apiRequest(
      "post",
      `${PLAYER_PROPERTY(code, playerId, propertyId)}/mortgage`,
    ),
};
