import { Routes, Route } from 'react-router-dom';
import PeoplePage from './pages/PeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SearchPage from './pages/SearchPage';
import SharePage from './pages/SharePage';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPeoplePage from './pages/AdminPeoplePage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminPersonEditPage from './pages/AdminPersonEditPage';
import AdminProjectEditPage from './pages/AdminProjectEditPage';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:slug" element={<PersonDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<PersonDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/share" element={<SharePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/people" element={<AdminPeoplePage />} />
        <Route path="/admin/people/:slug/edit" element={<AdminPersonEditPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/projects/:slug/edit" element={<AdminProjectEditPage />} />
      </Routes>
    </div>
  );
}

export default App;

