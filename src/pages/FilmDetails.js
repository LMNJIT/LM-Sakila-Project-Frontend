import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filmsAPI } from '../services/api';

function FilmDetails() {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFilm();
  }, [filmId]);

  const loadFilm = async () => {
    try {
      setLoading(true);
      const data = await filmsAPI.getFilmById(filmId);
      
      if (!data) {
        setError('film not found');
        return;
      }

      setFilm(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load film details:', err);
      setError('failed to load film');
      // add retry button?
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!film) return <div>Film not found</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-search" style={{ marginBottom: '1rem' }}>
        Back
      </button>

      <h1 className="page-title">{film.title}</h1>
      <div className="card">
        <p><strong>Film ID:</strong> {film.film_id}</p>
        <p><strong>Category:</strong> {film.category || 'N/A'}</p>
        {film.description && <p><strong>Description:</strong> {film.description}</p>}
        {film.release_year && <p><strong>Release Year:</strong> {film.release_year}</p>}
        {film.length && <p><strong>Length:</strong> {film.length} minutes</p>}
        {film.rating && <p><strong>Rating:</strong> {film.rating}</p>}
        {film.rental_rate && <p><strong>Rental Rate:</strong> ${film.rental_rate}</p>}
      </div>
    </div>
  );
}

export default FilmDetails;
