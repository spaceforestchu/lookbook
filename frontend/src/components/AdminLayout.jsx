import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Home } from 'lucide-react';

function AdminLayout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: '#4242ea'}}>
              L
            </div>
            <div>
              <div className="font-semibold text-base">Lookbook</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/people"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive('/admin/people')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>People</span>
            </Link>
            
            <Link
              to="/admin/projects"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive('/admin/projects')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Projects</span>
            </Link>
          </nav>
        </div>

        {/* Back to Public Site */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <Link
            to="/people"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;

