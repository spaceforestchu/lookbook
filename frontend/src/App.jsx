import { Routes, Route } from 'react-router-dom';
import PeoplePage from './pages/PeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SearchPage from './pages/SearchPage';
import SharePage from './pages/SharePage';
import HomePage from './pages/HomePage';

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
      </Routes>
    </div>
  );
}

export default App;

