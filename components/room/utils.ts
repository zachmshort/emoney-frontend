export type CreateRoomFormData = {
  roomName:string
  roomCode:string
  playerName:string
  playerColor:string
  startingCash: number,
  houses:number, 
  hotels:number, 
}

export const InitialCreateRoomFormData:CreateRoomFormData= {
  roomName: "",
  roomCode: "",
  playerName: "",
  playerColor: "",
  startingCash: 1500,
  houses: 32,
  hotels: 12,
};

export type JoinRoomFormData = {
  name:string
  color:string
  code:string
}

export const InitialJoinRoomFormData:JoinRoomFormData= {
  name: "",
  color: "",
  code: "",
};


