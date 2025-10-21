import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-hero__title">Welcome to Lookbook</h1>
        <p className="home-hero__subtitle">
          Discover talented individuals and innovative projects
        </p>
        <div className="home-hero__actions">
          <Link to="/people" className="btn btn--primary">Browse People</Link>
          <Link to="/projects" className="btn btn--outline">View Projects</Link>
        </div>
      </div>

      <div className="home-features">
        <div className="home-feature">
          <div className="home-feature__icon">👥</div>
          <h3 className="home-feature__title">Talented People</h3>
          <p className="home-feature__text">
            Browse profiles of skilled professionals with diverse expertise
          </p>
          <Link to="/people" className="home-feature__link">Explore People →</Link>
        </div>

        <div className="home-feature">
          <div className="home-feature__icon">🚀</div>
          <h3 className="home-feature__title">Amazing Projects</h3>
          <p className="home-feature__text">
            Discover innovative projects across various industries and technologies
          </p>
          <Link to="/projects" className="home-feature__link">View Projects →</Link>
        </div>

        <div className="home-feature">
          <div className="home-feature__icon">🔍</div>
          <h3 className="home-feature__title">Smart Search</h3>
          <p className="home-feature__text">
            Find exactly what you're looking for with powerful filtering options
          </p>
          <Link to="/search" className="home-feature__link">Start Searching →</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;


