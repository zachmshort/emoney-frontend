const isProduction = process.env.NODE_ENV === "production";

const getWsUrl = (roomCode: string) => {
  const protocol = isProduction ? "wss" : "ws";
  const host = process.env.NEXT_PUBLIC_API_URL_NO_PREFIX ?? "localhost:8080";

  return `${protocol}://${host}/v1/ws/room/${roomCode}`;
};

export { getWsUrl };
