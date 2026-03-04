import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filmsAPI, rentalsAPI } from '../services/api';

function FilmDetails() {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerIdInput, setCustomerIdInput] = useState('');
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalError, setRentalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(0);

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
      
      // load inventory count
      try {
        const inventoryData = await filmsAPI.getFilmInventory(filmId);
        setInventoryCount(inventoryData.available_count || 0);
      } catch (err) {
        console.error('Failed to load inventory:', err);
        setInventoryCount(0);
      }
    } catch (err) {
      console.error('Failed to load film details:', err);
      setError('failed to load film');
      // add retry button?
    } finally {
      setLoading(false);
    }
  };

  const handleRentMovie = async (e) => {
    e.preventDefault();
    setRentalError(null);
    setSuccessMessage(null);

    // validate customer ID
    const customerId = customerIdInput.trim();
    if (!customerId) {
      setRentalError('Please enter a customer ID');
      return;
    }

    if (isNaN(customerId) || parseInt(customerId) <= 0) {
      setRentalError('Customer ID must be a valid positive number');
      return;
    }

    try {
      setRentalLoading(true);
      const rentalData = await rentalsAPI.createRental({
        customer_id: parseInt(customerId),
        film_id: parseInt(filmId),
        staff_id: 1 // default staff ID
      });

      setSuccessMessage(`Successfully rented "${rentalData.title}" to ${rentalData.first_name} ${rentalData.last_name}`);
      setCustomerIdInput('');
      
      // reload inventory count
      try {
        const inventoryData = await filmsAPI.getFilmInventory(filmId);
        setInventoryCount(inventoryData.available_count || 0);
      } catch (err) {
        console.error('Failed to reload inventory:', err);
      }

      // clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to create rental', err);
      setRentalError(err.message || 'Failed to create rental');
    } finally {
      setRentalLoading(false);
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
        <p><strong>Copies Available:</strong> {inventoryCount}</p>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontWeight: 'normal' }}>Rent This Movie</h2>
        {successMessage && (
          <div className="success" style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            {successMessage}
          </div>
        )}
        {rentalError && (
          <div className="error" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            {rentalError}
          </div>
        )}
        <form onSubmit={handleRentMovie} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter customer id"
            value={customerIdInput}
            onChange={(e) => setCustomerIdInput(e.target.value)}
            disabled={rentalLoading}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
          />
          <button
            type="submit"
            className="btn btn-search"
            disabled={rentalLoading || inventoryCount === 0}
            style={{ cursor: rentalLoading || inventoryCount === 0 ? 'not-allowed' : 'pointer' }}
          >
            {rentalLoading ? 'Processing...' : 'Rent Movie'}
          </button>
        </form>
        {inventoryCount === 0 && (
          <p style={{ color: '#000000', marginTop: '0.5rem' }}>No copies available for rental</p>
        )}
      </div>
    </div>
  );
}

export default FilmDetails;
