interface RoomPageProps {
  params: {
    code: string;
  };
}

const RoomPage = async ({ params }: RoomPageProps) => {
  const { code } = params;
  return <div>Room Code: {code}</div>;
};

export default RoomPage;
