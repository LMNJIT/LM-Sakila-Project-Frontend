import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { actorsAPI } from '../services/api';

function ActorDetails() {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [topFilms, setTopFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [actorId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const actorData = await actorsAPI.getActorById(actorId);
      setActor(actorData);
      setTopFilms(actorData.top_films || []);
      setError(null);
    } catch (err) {
      console.error('Error loading actor:', err);
      setError('failed to load actor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-search" style={{marginBottom: '1rem'}}>
        Back
      </button>

      <h1 className="page-title">{actor.first_name} {actor.last_name}</h1>
      <h2 className="section-title">Top 5 Rented Films</h2>
      {(
        <div className="grid grid-2">
          {topFilms.map(film => (
            <Link to={`/films/${film.film_id}`} key={film.film_id} className="card" style={{textDecoration: 'none', color: 'inherit'}}>
              <h3>{film.title}</h3>
              <p><strong>Category:</strong> {film.category}</p>
              <p><strong>Times Rented:</strong> {film.rental_count || film.rented || 0}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActorDetails;
