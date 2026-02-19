import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

// validation helper function
function validateCustomerSearch(query) {
  if (!query || query.trim() === '') {
    return false;
  }
  if (query.length > 50) {
    return false;
  }
  return true;
}

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchValidationError, setSearchValidationError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    
    // validate search query
    if (!validateCustomerSearch(searchQuery)) {
      setSearchValidationError('invalid search query');
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      setCurrentPage(1);
      setSearchValidationError('');
      
      const results = await customersAPI.searchCustomers(searchQuery);
      
      // TODO: handle null/undefined results from backend
      if (!results) {
        setCustomers([]);
      } else {
        setCustomers(results);
      }
      
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError('search failed');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // clear search and filters
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchValidationError('');
    setCurrentPage(1);
    // should probably reload customers here but testing without it first
  };

  return (
    <div>
      <h1 className="page-title">Customers</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by customer..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchValidationError('');
          }}
        />
        {searchValidationError && <div style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>{searchValidationError}</div>}
        
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
        <p>no customers found</p>
      )}

      {!loading && customers.length > 0 && (
        <div className="grid grid-2">
          {customers.map(customer => (
            <div key={customer.customer_id} className="card">
              <h3>{customer.first_name} {customer.last_name}</h3>
              <p><strong>ID:</strong> {customer.customer_id}</p>
              <p><strong>Email:</strong> {customer.email}</p>
            </div>
          ))}
        </div>
      )}

      {!isSearching && totalPages > 1 && (
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
