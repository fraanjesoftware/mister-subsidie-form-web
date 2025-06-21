function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          React + Vite + Tailwind CSS
        </h1>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome!
          </h2>
          <p className="text-gray-600 mb-4">
            Your React Vite project with Tailwind CSS is set up and ready to go.
          </p>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App