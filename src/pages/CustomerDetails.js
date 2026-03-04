import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersAPI } from '../services/api';

function CustomerDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-search" style={{ marginBottom: '1rem' }}>
        Back
      </button>

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
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      backgroundColor: rental.status === 'returned' ? '#d4edda' : '#fff3cd',
                      color: rental.status === 'returned' ? '#155724' : '#856404'
                    }}>
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerDetails;
