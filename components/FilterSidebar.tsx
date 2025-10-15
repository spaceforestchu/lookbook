export default function FilterSidebar() {
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 p-6 overflow-y-auto fixed left-0 top-0 bottom-0">
      {/* Cohort Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Cohort</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">March '25: AI-Native</span>
          </label>
          <label className="flex items-center gap-2 pl-6 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">11.0: Web</span>
          </label>
          <label className="flex items-center gap-2 pl-6 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">10.0: Web</span>
          </label>
        </div>
      </div>

      {/* Industry Expertise Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Industry Expertise</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Consumer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Fintech</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Healthcare</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Real Estate</span>
          </label>
        </div>
      </div>

      {/* Additional Filters Section */}
      <div className="mb-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Has Demo Video</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Open to Relocate</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Open to Work</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Freelance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">NYC-based</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-700">Remote Only</span>
          </label>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 pt-8 border-t border-neutral-200">
        <h3 className="mb-2 text-sm font-semibold text-blue-600">
          Contact for Resume /<br/>Hiring Interest
        </h3>
        <p className="text-sm text-neutral-900 font-medium mb-1">Timothy Asprec</p>
        <a
          href="mailto:timothyasprec@pursuit.org"
          className="text-sm text-neutral-900 hover:underline break-all"
        >
          timothyasprec@pursuit.org
        </a>
        <p className="mt-2 text-xs text-neutral-500">
          Unauthorized contact violates Fair privacy policies
        </p>
      </div>
    </aside>
  );
}
