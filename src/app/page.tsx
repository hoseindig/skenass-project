export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Welcome to Tailwind Next.js Sample
      </h1>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4">Card Title</h2>
        <p className="text-gray-700 mb-6">
          This is a simple card example using Tailwind CSS with Next.js. You can
          customize it easily!
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}
