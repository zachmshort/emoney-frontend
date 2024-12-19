type tParams = Promise<{ code: string }>;

export default async function RoomPage({ params }: { params: tParams }) {
  const { code } = await params;
  return <>{code}</>;
}
