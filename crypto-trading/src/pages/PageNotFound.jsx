export default function PageNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-5xl font-bold text-zinc-800">404</h1>
      <p className="text-zinc-500 text-lg">Page not found</p>

      <a
        href="/"
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Go Home
      </a>
    </div>
  );
}
