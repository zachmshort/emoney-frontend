// import { Player } from "@/types/schema";
// import { useEffect, useState } from "react";
// // import PlayerDetails from "./details";

// const PlayerList = ({ roomCode }: { roomCode: string }) => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       const response = await fetch(
//         `https://emoney.up.railway.app/player/room/${roomCode}`
//       );
//       const data = await response.json();
//       setPlayers(data);
//     };

//     fetchPlayers();
//   }, [roomCode]);

//   return (
//     <div>
//       {/* {players.map((player) => (
//         <PlayerCard
//           key={player.id}
//           player={player}
//           onClick={() => setSelectedPlayer(player.id)}
//         />
//       ))} */}
//       {/* {selectedPlayer && <PlayerDetails playerId={selectedPlayer} />} */}
//     </div>
//   );
// };

// export { PlayerList };
