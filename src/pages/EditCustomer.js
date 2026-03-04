import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

function EditCustomer({ isOpen, onClose, customer, onCustomerUpdated }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    address2: '',
    district: '',
    postal_code: '',
    phone: '',
    city_id: '',
    active: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        address: customer.address || '',
        address2: customer.address2 || '',
        district: customer.district || '',
        postal_code: customer.postal_code || '',
        phone: customer.phone || '',
        city_id: customer.city_id || '',
        active: customer.active || 1
      });
      setError('');
    }
  }, [customer, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    
    // convert numeric fields
    const numericFields = ['active', 'city_id'];
    const fieldValue = numericFields.includes(name) ? parseInt(value, 10) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // client-side validation
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    if (!formData.district.trim()) {
      setError('District is required');
      return;
    }
    if (!formData.postal_code.trim()) {
      setError('Postal code is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.city_id || formData.city_id < 1) {
      setError('City ID must be a positive number');
      return;
    }

    try {
      setLoading(true);
      await customersAPI.updateCustomer(customer.customer_id, formData);
      
      // fetch updated customer data to get all fields including address
      const updatedCustomer = await customersAPI.getCustomerById(customer.customer_id);
      
      setError('');
      
      // callback to parent
      onCustomerUpdated(updatedCustomer);
      onClose();
    } catch (err) {
      console.error('Failed to update customer:', err);
      setError(err.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      email: customer?.email || '',
      address: customer?.address || '',
      address2: customer?.address2 || '',
      district: customer?.district || '',
      postal_code: customer?.postal_code || '',
      phone: customer?.phone || '',
      city_id: customer?.city_id || '',
      active: customer?.active || 1
    });
    setError('');
    onClose();
  };

  if (!isOpen || !customer) return null;

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
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>Edit Customer</h2>
        
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              maxLength="45"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              maxLength="45"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              maxLength="50"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              District *
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Postal Code *
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Phone *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              City ID *
            </label>
            <input
              type="number"
              name="city_id"
              value={formData.city_id}
              onChange={handleInputChange}
              min="1"
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Active
            </label>
            <select
              name="active"
              value={formData.active}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '0.95rem'
              }}
              disabled={loading}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
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
              style={{ padding: '0.5rem 1rem' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCustomer;
