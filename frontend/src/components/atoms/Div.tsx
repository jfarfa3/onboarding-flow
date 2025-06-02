export default function Div({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}