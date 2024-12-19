// import { useEffect, useState } from "react";

// const PlayerDetails = ({ playerId }: { playerId: string }) => {
//   const [details, setDetails] = useState<PlayerDetailsType | null>(null);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       const response = await fetch(`https://emoney.up.railway.app/${playerId}`);
//       const data = await response.json();
//       setDetails(data);
//     };

//     fetchDetails();
//   }, [playerId]);

//   return details ? (
//     <div>
//       <h2>{details.player.name}</h2>
//       <p>Balance: ${details.player.balance}</p>
//       <div className="properties">
//         {details.properties.map((prop) => (
//           <PropertyCard key={prop.id} property={prop} />
//         ))}
//       </div>
//     </div>
//   ) : null;
// };
// export default PlayerDetails;
