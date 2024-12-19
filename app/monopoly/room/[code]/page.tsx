interface p {
  params: {
    code: string | null;
  };
}
const RoomPage = async ({ params }: p) => {
  const { code } = await params;
  return <></>;
};

export default RoomPage;
