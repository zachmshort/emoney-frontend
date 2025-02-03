export interface PlayerGame {
  roomCode: string;
  playerId: string;
}

export const playerStore = {
  setPlayerIdForRoom(roomCode: string, playerId: string) {
    localStorage.setItem(`room_${roomCode}_playerId`, playerId);
  },

  getPlayerIdForRoom(roomCode: string): string | null {
    return localStorage.getItem(`room_${roomCode}_playerId`);
  },

  clearPlayerDataForRoom(roomCode: string) {
    localStorage.removeItem(`room_${roomCode}_playerId`);
  },

  clearAllPlayerData() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("room_") && key.endsWith("_playerId")) {
        localStorage.removeItem(key);
      }
    });
  },

  trimRoom(val: string) {
    return val;
  },
};
