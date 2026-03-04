import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersAPI, rentalsAPI } from '../services/api';
import EditCustomer from './EditCustomer';

function CustomerDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [returnLoading, setReturnLoading] = useState(null);
  const [returnError, setReturnError] = useState(null);
  const [returnSuccess, setReturnSuccess] = useState(null);

  useEffect(() => {
    loadData();
  }, [customerId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const customerData = await customersAPI.getCustomerById(customerId);
      const rentalData = await customersAPI.getCustomerRentals(customerId);
      
      if (!customerData) {
        setError('customer not found');
        return;
      }

      setCustomer(customerData);
      setRentals(rentalData || []);
      setError(null);
    } catch (err) {
      console.error('Error loading customer details:', err);
      setError('failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  const handleReturnRental = async (rentalId, filmTitle) => {
    setReturnError(null);
    setReturnSuccess(null);

    try {
      setReturnLoading(rentalId);
      await rentalsAPI.returnRental(rentalId);

      // reload rentals to show updated status
      const rentalData = await customersAPI.getCustomerRentals(customerId);
      setRentals(rentalData || []);

      setReturnSuccess(`"${filmTitle}" marked as returned`);
      setTimeout(() => setReturnSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to return rental:', err);
      setReturnError(err.message || 'Failed to return rental');
    } finally {
      setReturnLoading(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-search">
          Back
        </button>
        <button
          onClick={() => setShowEditModal(true)}
          className="btn btn-search"
          style={{ backgroundColor: '#ffffff', color: '#000' }}
        >
          Edit
        </button>
      </div>

      <h1 className="page-title">{customer.first_name} {customer.last_name}</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ marginTop: -18, marginBottom: '1rem' }}></h2>
        <p><strong>Customer ID:</strong> {customer.customer_id}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Status:</strong> {customer.active === 1 ? 'Active' : 'Inactive'}</p>
        
        <h2 className="section-title" style={{ marginTop: -5, marginBottom: '1rem' }}>Address</h2>
        <p><strong>Address:</strong> {customer.address}</p>
        <p><strong>District:</strong> {customer.district}</p>
        <p><strong>Postal Code:</strong> {customer.postal_code}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
      </div>

      <h2 className="section-title">Rental History ({rentals.length})</h2>
      {returnSuccess && (
        <div style={{ color: 'green', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
          {returnSuccess}
        </div>
      )}
      {returnError && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          {returnError}
        </div>
      )}
      {rentals.length === 0 ? (
        <p>No rentals found</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '2rem',
            backgroundColor: '#fff'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#333' }}>Film Title</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#333' }}>Rental Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#333' }}>Return Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#333' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.rental_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{rental.title}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(rental.rental_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {rental.return_date 
                      ? new Date(rental.return_date).toLocaleDateString() 
                      : '-'
                    }
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      onClick={() => !rental.return_date && handleReturnRental(rental.rental_id, rental.title)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: rental.status === 'returned' ? '#d4edda' : '#fff3cd',
                        color: rental.status === 'returned' ? '#155724' : '#856404',
                        cursor: !rental.return_date ? 'pointer' : 'default',
                        transition: !rental.return_date ? 'opacity 0.2s' : 'none'
                      }}
                      onMouseEnter={(e) => !rental.return_date && (e.target.style.opacity = '0.7')}
                      onMouseLeave={(e) => !rental.return_date && (e.target.style.opacity = '1')}
                      disabled={returnLoading === rental.rental_id}
                    >
                      {returnLoading === rental.rental_id ? 'Returning...' : rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditCustomer
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={customer}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </div>
  );
}

export default CustomerDetails;
