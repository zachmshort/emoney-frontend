const RoomPage = async ({ params }: { params: { code: string } }) => {
  const { code } = await params;
  return <div>Room Code: {code}</div>;
};

export default RoomPage;
