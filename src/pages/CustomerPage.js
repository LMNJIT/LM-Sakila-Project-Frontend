import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customersAPI } from '../services/api';

// validation function to check search query
function validateCustomerSearch(query, type) {
  if (!query || query.trim() === '') {
    return { isValid: false, message: 'search cannot be empty' };
  }

  if (type === 'id') {
    if (!query.match(/^\d+$/)) {
      return { isValid: false, message: 'customer id must be a number' };
    }
  }

  if (type === 'first_name' && query.length < 2) {
    return { isValid: false, message: 'first name too short' };
  }

  if (type === 'last_name' && query.length < 2) {
    return { isValid: false, message: 'last name too short' };
  }

  if (query.length > 100) {
    return { isValid: false, message: 'search too long' };
  }

  return { isValid: true, message: '' };
}

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [validationError, setValidationError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const ITEMS_PER_PAGE = 21;

  useEffect(() => {
    if (!isSearching) {
      loadCustomers();
    }
  }, [currentPage, isSearching]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersAPI.getCustomers(currentPage, 21);
      // step 1: fetch, step 2: parse response, step 3: set state
      setCustomers(data.customers || data);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError('failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // validate search input before sending to api
    const validation = validateCustomerSearch(searchQuery, searchType);
    
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      setCurrentPage(1);
      setValidationError('');
      
      const results = await customersAPI.searchCustomers(searchQuery.trim(), searchType);
      
      // handle empty results
      if (!results || results.length === 0) {
        setCustomers([]);
        setAllSearchResults([]);
        return;
      }

      setAllSearchResults(results);
      const totalPgs = Math.ceil(results.length / ITEMS_PER_PAGE);
      setTotalPages(totalPgs);
      setCustomers(results.slice(0, ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      console.error('search failed', err);
      setError('search failed');
      setCustomers([]);
      setAllSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching && allSearchResults.length > 0) {
      const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      setCustomers(allSearchResults.slice(startIdx, endIdx));
    }
  }, [currentPage, isSearching, allSearchResults]);

  // clear search and filters
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setAllSearchResults([]);
    setCurrentPage(1);
    setValidationError('');
    setError('');
  };

  return (
    <div>
      <h1 className="page-title">Customers</h1>

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
            <option value="id">Customer ID</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
          </select>
        </div>
        
        {validationError && <div style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>{validationError}</div>}
        
        <input
          type="text"
          className="search-bar"
          placeholder={
            searchType === 'id' ? 'Enter customer id...' :
            searchType === 'first_name' ? 'Enter first name...' :
            'Enter last name...'
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

      {!loading && customers.length === 0 && !isSearching && (
        <p>No customers found.</p>
      )}

      {!loading && customers.length === 0 && isSearching && (
        <p>no results found</p>
      )}

      {!loading && customers.length > 0 && (
        <>
          {isSearching && <h2 className="section-title">Search Results ({allSearchResults.length})</h2>}
          <div className="grid grid-2">
            {customers.map(customer => (
              <Link to={`/customers/${customer.customer_id}`} key={customer.customer_id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{customer.first_name} {customer.last_name}</h3>
                <p><strong>ID:</strong> {customer.customer_id}</p>
                <p><strong>Email:</strong> {customer.email}</p>
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

export default CustomerPage;
