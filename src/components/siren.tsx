export default function Siren() {
  return (
    <div className="flex space-x-1">
      {/* Blue Light */}
      <div className="h-4 w-4 animate-ping rounded-full bg-blue-500 duration-150"></div>
      {/* Red Light Delayed */}
      <div className="h-4 w-4 animate-ping rounded-full bg-red-500 delay-200 duration-150"></div>
      {/* Blue Light Delayed */}
      <div className="delay-400 h-4 w-4 animate-ping rounded-full bg-blue-500 duration-150"></div>
    </div>
  );
}
