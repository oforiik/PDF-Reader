function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Custom Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PDF to Audio Converter
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload a PDF document and convert it to an audio file for easy listening. 
            Perfect for accessibility, multitasking, or learning on the go.
          </p>
          
          {/* Simple buttons without Relume */}
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Started
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload your PDF
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Choose File
            </button>
          </div>
        </div>

        {/* Test Tailwind */}
        <div className="mt-8 text-center">
          <p className="text-lg text-blue-600 font-medium">
            ✅ Tailwind is working if this text is large and blue!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;