export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] p-8 text-white">
      <div className="w-full max-w-4xl rounded-lg bg-[#1DB954] p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-5xl font-extrabold tracking-wide">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-center text-xl text-gray-200">
          This is a protected admin area where you can manage your content,
          users, and settings.
        </p>
        <div className="mt-8 text-center">
          <button className="rounded-lg border-2 border-[#1DB954] bg-black px-6 py-2 font-semibold text-[#1DB954] transition duration-300 hover:bg-[#1DB954] hover:text-black">
            Manage Content
          </button>
        </div>
      </div>
    </div>
  );
}
