import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI, actorsAPI } from '../services/api';

function LandingPage() {
  const [topFilms, setTopFilms] = useState([]);
  const [topActors, setTopActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Tried Promise.all() approach first but had issues with error handling
      // const [filmsRes, actorsRes] = await Promise.all([
      //   filmsAPI.getTopRented(),
      //   actorsAPI.getTopActors()
      // ]);
      
      const films = await filmsAPI.getTopRented();
      setTopFilms(films);
      const actors = await actorsAPI.getTopActors();
      setTopActors(actors);
      setError(null);
    } catch (err) {
      console.error('Landing page error:', err);
      setError('failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">Welcome to Movie Rental Store</h1>

      <section>
        <h2 className="section-title">Top 5 Rented Films</h2>
        <div className="grid grid-2">
          {topFilms.map(film => (
            <Link to={`/films/${film.film_id}`} key={film.film_id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{film.title}</h3>
              <p><strong>Category:</strong> {film.category}</p>
              <p><strong>Times Rented:</strong> {film.rented || film.rental_count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Top 5 Actors</h2>
        <div className="grid grid-2">
          {topActors.map(actor => (
            <Link to={`/actors/${actor.actor_id}`} key={actor.actor_id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{actor.first_name} {actor.last_name}</h3>
              <p><strong>Films:</strong> {actor.movies || actor.film_count}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
