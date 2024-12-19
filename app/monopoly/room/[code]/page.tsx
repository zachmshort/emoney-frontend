interface Params {
  code: string | null;
}

const RoomPage = ({ params }: { params: Params }) => {
  const { code } = params;
  console.log(code);
  return <></>;
};

export default RoomPage;
