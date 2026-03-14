export default function Loader({ fullScreen = false, text = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
