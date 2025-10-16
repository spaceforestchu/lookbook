import Link from 'next/link';

type FilterSidebarProps = {
  currentPage?: 'projects' | 'people';
};

export default function FilterSidebar({ currentPage = 'people' }: FilterSidebarProps) {
  return (
    <div className="hidden lg:block flex-shrink-0 m-4 self-start w-64">
      {/* Tab Navigation - Above the panel */}
      <div className="flex items-center gap-0 relative z-10" style={{ marginBottom: '-2px' }}>
        <Link
          href="/projects/modal-demo"
          className={`flex-1 text-center px-6 py-4 text-sm font-bold transition-all ${
            currentPage === 'projects'
              ? 'bg-[#E8E8E8] text-blue-600 border-l-2 border-r-2 border-t-2 border-white rounded-tl-3xl rounded-tr-3xl'
              : 'bg-transparent text-gray-500 hover:text-gray-700 border-l-2 border-t-2 border-white rounded-tl-3xl rounded-tr-3xl'
          }`}
        >
          PROJECTS
        </Link>
        <Link
          href="/people/modal-demo"
          className={`flex-1 text-center px-6 py-4 text-sm font-bold transition-all ${
            currentPage === 'people'
              ? 'bg-[#E8E8E8] text-blue-600 border-l-2 border-r-2 border-t-2 border-white rounded-tl-3xl rounded-tr-3xl'
              : 'bg-transparent text-gray-500 hover:text-gray-700 border-r-2 border-t-2 border-white rounded-tl-3xl rounded-tr-3xl'
          }`}
        >
          PEOPLE
        </Link>
      </div>

      {/* Sidebar Panel - Below the tabs */}
      <aside className={`bg-[#E8E8E8] rounded-b-3xl border-l-2 border-r-2 border-b-2 border-t-2 border-white shadow-lg overflow-y-auto w-full relative ${
        currentPage === 'people' ? 'rounded-tl-lg' : ''
      }`}>
      {/* Cover panels top corners to prevent double border */}
      {currentPage === 'people' && (
        <>
          <div className="absolute top-[-2px] left-0 right-1/2 mr-1 h-0 border-t-2 border-white z-20"></div>
          <div className="absolute top-[-2px] right-[-2px] w-[2px] h-[4px] bg-white z-20"></div>
          <div className="absolute top-[-2px] left-[-2px] w-[12px] h-[12px] bg-[#E8E8E8] rounded-tl-xl z-10"></div>
        </>
      )}
      {currentPage === 'projects' && (
        <>
          <div className="absolute top-[-2px] right-0 left-1/2 ml-1 h-0 border-t-2 border-white z-20"></div>
          <div className="absolute top-[-2px] left-[-2px] w-[2px] h-[4px] bg-white z-20"></div>
        </>
      )}
      <div className="px-6 pt-6">

      {/* Cohort Section */}
      <div className="mb-6 pb-6 border-b border-white">
        <h2 className="mb-4 text-base font-bold text-gray-900">Cohort</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">March '25: AI-Native</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">11.0: Web</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">10.0: Web</span>
          </label>
        </div>
      </div>

      {/* Industry Expertise Section */}
      <div className="mb-6 pb-6 border-b border-white">
        <h2 className="mb-4 text-base font-bold text-gray-900">Industry</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">All</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Consumer</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Fintech</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Healthcare</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Real Estate</span>
          </label>
        </div>
      </div>

      {/* Additional Filters Section */}
      <div className="mb-6">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Has Demo Video</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Open to Relocate</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Open to Work</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Freelance</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">NYC-based</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Remote Only</span>
          </label>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 pt-8 pb-8 border-t border-white">
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
        <p className="mt-4 text-xs text-neutral-500">
          Unauthorized contact violates Fair privacy policies
        </p>
      </div>

      </div>
      </aside>
    </div>
  );
}
