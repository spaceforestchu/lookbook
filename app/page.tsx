import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Lookbook</h1>
      <p className="text-gray-600 text-lg text-center max-w-2xl">
        A simple directory for showcasing people and projects. Explore our team and discover our work.
      </p>

      {/* Navigation links */}
      <div className="flex gap-4 mt-4">
        <Link
          href="/people"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View People
        </Link>
        <Link
          href="/projects"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          View Projects
        </Link>
      </div>

      {/* Admin link (temporary, no auth) */}
      <Link
        href="/admin/intake"
        className="mt-8 text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Admin Intake
      </Link>
    </div>
  );
}
