interface RoomPageProps {
  params: {
    code: string;
  };
}

const RoomPage = async ({ params }: RoomPageProps) => {
  const { code } = await params;
  return <div>Room Code: {code}</div>;
};

export default RoomPage;
