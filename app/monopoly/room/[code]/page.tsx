interface p {
  params: {
    code: string | null;
  };
}

const RoomPage = ({ params }: p) => {
  const { code } = params;
  console.log(code);
  return <></>;
};

export default RoomPage;
