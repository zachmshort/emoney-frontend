interface p {
  params: {
    code: string | null;
  };
}
const RoomPage = async ({ params }: p) => {
  const { code } = await params;
  console.log(code);
  return <></>;
};

export default RoomPage;
