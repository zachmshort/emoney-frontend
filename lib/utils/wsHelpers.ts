const getBaseUrl = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return isProduction
    ? "https://emoney.up.railway.app"
    : "http://localhost:8080";
};

const getWsUrl = (code: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const wsProtocol = isProduction ? "wss" : "ws";
  const baseUrl = isProduction ? "emoney.up.railway.app" : "localhost:8080";

  return `${wsProtocol}://${baseUrl}/ws/room/${code}`;
};

const getEndpoints = {
  room: {
    getDetails: (code: string) => `${getBaseUrl()}/player/room/${code}`,
    getProperties: (code: string) =>
      `${getBaseUrl()}/property/available/${code}`,
  },

  player: {
    getDetails: (playerId: string) =>
      `${getBaseUrl()}/player/${playerId}/details`,
  },
};
export { getBaseUrl, getEndpoints, getWsUrl };
