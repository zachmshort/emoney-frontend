export const getWsUrl = (code: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "wss://emoney.up.railway.app"
      : "ws://localhost:8080";

  return `${baseUrl}/ws/room/${code}`;
};
