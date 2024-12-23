import { toast } from "sonner";
import { getEndpoints } from "./wsHelpers";
import { Player } from "@/types/schema";

const fetchRoomData = async (
  code: string,
  playerStore: any,
  setPlayer: Function,
  setOtherPlayers: Function,
  setRoom: Function,
  setEventHistory: Function
) => {
  try {
    const storedPlayerId = playerStore.getPlayerIdForRoom(code);

    if (!storedPlayerId) {
      toast.error("No player ID found for this room");
      return;
    }

    const roomResponse = await fetch(getEndpoints.room.getDetails(code), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const roomData = await roomResponse.json();

    const playersWithProperties = await Promise.all(
      roomData.players.map(async (p: Player) => {
        const propertyResponse = await fetch(
          getEndpoints.player.getDetails(p.id),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const propertyData = await propertyResponse.json();
        return {
          ...p,
          properties: propertyData.properties,
        };
      })
    );

    const currentPlayer = playersWithProperties.find(
      (p: Player) => p.id === storedPlayerId
    );

    const remainingPlayers = playersWithProperties.filter(
      (p: Player) => p.id !== storedPlayerId
    );

    setPlayer(currentPlayer || null);
    setOtherPlayers(remainingPlayers);
    setRoom(roomData.room);
    setEventHistory(roomData.eventHistory);
  } catch (error) {
    console.error("Failed to fetch room data:", error);
    toast.error("Failed to fetch room data");
  }
};
const fetchAvailableProperties = async (
  roomCode: string,
  setAvailableProperties: Function
) => {
  try {
    const response = await fetch(
      `https://emoney.up.railway.app/property/available/${roomCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch available properties");
    }

    const data = await response.json();
    setAvailableProperties(data.availableProperties);
  } catch (error) {
    console.error("Error fetching available properties:", error);
    toast.error("Unable to retrieve available properties");
  }
};
export { fetchAvailableProperties, fetchRoomData };
