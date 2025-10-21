import { Link } from 'react-router-dom';
import './PersonCard.css';

function PersonCard({ person }) {
  return (
    <Link to={`/people/${person.slug}`} className="person-card">
      <div className="person-card__header">
        {person.photo_url ? (
          <img 
            src={person.photo_url} 
            alt={person.name}
            className="person-card__photo"
          />
        ) : (
          <div className="person-card__photo person-card__photo--placeholder">
            {person.name?.charAt(0) || '?'}
          </div>
        )}
      </div>

      <div className="person-card__body">
        <h3 className="person-card__name">{person.name}</h3>
        
        {person.title && (
          <p className="person-card__title">{person.title}</p>
        )}

        {person.open_to_work && (
          <span className="badge badge--success person-card__badge">
            Open to Work
          </span>
        )}

        {person.skills && person.skills.length > 0 && (
          <div className="person-card__skills">
            {person.skills.slice(0, 5).map(skill => (
              <span key={skill} className="badge badge--primary">
                {skill}
              </span>
            ))}
            {person.skills.length > 5 && (
              <span className="badge badge--secondary">
                +{person.skills.length - 5}
              </span>
            )}
          </div>
        )}

        {person.industry_expertise && person.industry_expertise.length > 0 && (
          <div className="person-card__industries">
            <span className="text-muted text-small">
              {person.industry_expertise.slice(0, 2).join(', ')}
              {person.industry_expertise.length > 2 && ` +${person.industry_expertise.length - 2}`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default PersonCard;


