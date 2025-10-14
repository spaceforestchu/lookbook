import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Project Not Found
        </h1>
        <p className="text-gray-600 text-lg">
          Sorry, we couldn't find the project you're looking for.
        </p>
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Projects
      </Link>
    </div>
  );
}
