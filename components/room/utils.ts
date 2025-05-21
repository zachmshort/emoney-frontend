type BaseRoomFormData = {
  playerName: string;
  playerColor: string;
  roomCode: string;
};

export type JoinRoomFormData = BaseRoomFormData;
export type CreateRoomFormData = BaseRoomFormData & {
  roomName: string;
  startingCash: number;
  houses: number;
  hotels: number;
};

export const InitialCreateRoomFormData:CreateRoomFormData= {
  roomName: "",
  roomCode: "",
  playerName: "",
  playerColor: "",
  startingCash: 1500,
  houses: 32,
  hotels: 12,
};

export const InitialJoinRoomFormData:JoinRoomFormData= {
  playerName: "",
  playerColor: "",
  roomCode: "",
};

export interface JoinProps{
  updateFormData: <K extends keyof JoinRoomFormData >(
    field: K,
    value: JoinRoomFormData[K]
  ) => void;
  formData: JoinRoomFormData;
}


export interface CreateProps{
  updateFormData: <K extends keyof CreateRoomFormData>(
    field: K,
    value: CreateRoomFormData[K]
  ) => void;
  formData: CreateRoomFormData;
}



