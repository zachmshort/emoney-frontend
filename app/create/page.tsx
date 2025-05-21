"use client";

import RoomForm from "@/components/room/join-create-room-steps";

const CreateRoom = () => {
  return (
      <RoomForm
        type="CREATE"
        placeholder="New Room Code"
        buttonText2="Create Room"
      />
  );
};

export default CreateRoom;
