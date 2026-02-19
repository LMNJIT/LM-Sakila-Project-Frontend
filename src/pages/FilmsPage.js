import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI } from '../services/api';

// validation function to check search query - similar to php validation
function validateSearchQuery(query, type) {
  if (!query || query.trim() === '') {
    return { isValid: false, message: 'search cannot be empty' };
  }

  if (type === 'title' && query.length < 2) {
    return { isValid: false, message: 'film name too short' };
  }

  if (type === 'actor' && query.length < 3) {
    return { isValid: false, message: 'actor name too short' };
  }

  if (query.length > 100) {
    return { isValid: false, message: 'search too long' };
  }

  return { isValid: true, message: '' };
}

function FilmsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [films, setFilms] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 21;

  useEffect(() => {
    if (!isSearching) {
      loadFilms();
    }
  }, [currentPage, isSearching]);

  const loadFilms = async () => {
    try {
      setLoading(true);
      const data = await filmsAPI.getAllFilms(currentPage, 21);
      // TODO: handle case where data structure changes from backend
      setFilms(data.films || data);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      // FIXME: backend sometimes returns different error format
      console.error('Error loading films:', err);
      setError('failed to load films');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // validate search input before sending to api (step 1: filter, step 2: validate, step 3: execute)
    const validation = validateSearchQuery(searchQuery, searchType);
    
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      setCurrentPage(1);
      setValidationError('');
      
      const results = await filmsAPI.searchFilms(searchQuery.trim(), searchType);
      
      // handle empty results
      if (!results || results.length === 0) {
        setFilms([]);
        setAllSearchResults([]);
        return;
      }

      setAllSearchResults(results);
      const totalPgs = Math.ceil(results.length / ITEMS_PER_PAGE);
      setTotalPages(totalPgs);
      setFilms(results.slice(0, ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      console.error('Search failed:', err);
      setError('search failed');
      setFilms([]);
      setAllSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching && allSearchResults.length > 0) {
      const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      setFilms(allSearchResults.slice(startIdx, endIdx));
    }
  }, [currentPage, isSearching, allSearchResults]);

  // clear search and validation errors
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setAllSearchResults([]);
    setCurrentPage(1);
    setValidationError('');
    setError('');
    // commented out - was trying to reload all films automatically but user might want to do it manually
    // loadFilms();
  };

  return (
    <div>
      <h1 className="page-title">Films</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#ffffff' }}>Search by:</label>
          <select 
            value={searchType} 
            onChange={(e) => {
              setSearchType(e.target.value);
              setValidationError('');
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="title">Film Name</option>
            <option value="category">Category</option>
            <option value="actor">Actor Name</option>
          </select>
        </div>
        
        {validationError && <div style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>{validationError}</div>}
        
        <input
          type="text"
          className="search-bar"
          placeholder={
            searchType === 'title' ? 'Enter film name...' :
            searchType === 'category' ? 'Enter category...' :
            'Enter actor name...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-search">Search</button>
          {isSearching && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      </form>

      {error && <div className="error">Error: {error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!loading && films.length === 0 && !isSearching && (
        <p>No films found.</p>
      )}

      {!loading && films.length === 0 && isSearching && (
        <p>no results found</p>
      )}

      {!loading && films.length > 0 && (
        <>
          {isSearching && <h2 className="section-title">Search Results ({allSearchResults.length})</h2>}
          <div className="grid grid-2">
            {films.map(film => (
              <Link to={`/films/${film.film_id}`} key={film.film_id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{film.title}</h3>
                <p><strong>Category:</strong> {film.category || 'N/A'}</p>
                <p><strong>Times Rented:</strong> {film.rented || film.rental_count || 0}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default FilmsPage;
