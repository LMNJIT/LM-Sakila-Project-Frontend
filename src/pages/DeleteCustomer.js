import React, { useState } from 'react';
import { customersAPI } from '../services/api';

function DeleteCustomer({ isOpen, onClose, onCustomerDeleted }) {
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCustomerId(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    if (!customerId.trim()) {
      setError('Customer ID is required');
      return;
    }

    if (!customerId.match(/^\d+$/)) {
      setError('Customer ID must be a number');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete Customer ID ${customerId}?`)) {
      return;
    }

    try {
      setLoading(true);
      await customersAPI.deleteCustomer(parseInt(customerId, 10));

      // reset form
      setCustomerId('');
      setError('');

      // callback to parent
      onCustomerDeleted(customerId);
      onClose();
    } catch (err) {
      console.error('Failed to delete customer:', err);
      setError(err.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCustomerId('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>Delete Customer</h2>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Customer ID *
            </label>
            <input
              type="text"
              value={customerId}
              onChange={handleInputChange}
              placeholder="Enter customer ID..."
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '0.95rem'
              }}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
              style={{ padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-search"
              disabled={loading}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff' }}
            >
              {loading ? 'Deleting...' : 'Delete Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteCustomer;
