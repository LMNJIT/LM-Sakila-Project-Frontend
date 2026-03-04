const API_BASE_URL = 'http://localhost:5001/api';

// const handleErrorResponse = (errorData) => {
//   if (errorData.error) {
//     return errorData.error;
//   } else if (errorData.message) {
//     return errorData.message;
//   }
//   return 'Unknown error occurred';
// };

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    // Try error.error first (our backend format), then error.message
    throw new Error(error.error || error.message || 'Request failed');
  }
  return response.json();
};

export const filmsAPI = {
  getAllFilms: async (page = 1, limit = 20) => {
    const url = `${API_BASE_URL}/films?page=${page}&limit=${limit}`;
    try {
      const response = await fetch(url, { mode: 'cors' });
      return handleResponse(response);
    } catch (error) {
      console.error('Fetch error in getAllFilms:', error);
      throw error;
    }
  },

  getTopRented: async () => {
    const response = await fetch(`${API_BASE_URL}/films/top-rented`, { mode: 'cors' });
    return handleResponse(response);
  },

  getFilmById: async (filmId) => {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}`, { mode: 'cors' });
    return handleResponse(response);
  },

  searchFilms: async (query, type = 'title') => {
    const response = await fetch(`${API_BASE_URL}/films/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`, { mode: 'cors' });
    return handleResponse(response);
  },

  getFilmInventory: async (filmId) => {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}/inventory`, { mode: 'cors' });
    return handleResponse(response);
  }
};

export const actorsAPI = {
  getTopActors: async () => {
    const response = await fetch(`${API_BASE_URL}/actors/top`, { mode: 'cors' });
    return handleResponse(response);
  },

  getActorById: async (actorId) => {
    const response = await fetch(`${API_BASE_URL}/actors/${actorId}`, { mode: 'cors' });
    return handleResponse(response);
  }
};

export const customersAPI = {
  getCustomers: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  searchCustomers: async (query, type = 'id') => {
    const response = await fetch(`${API_BASE_URL}/customers/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
    return handleResponse(response);
  },

  getCustomerById: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
    return handleResponse(response);
  },

  getCustomerRentals: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/rentals`);
    return handleResponse(response);
  },

  createCustomer: async (customerData) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    return handleResponse(response);
  },

  deleteCustomer: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  updateCustomer: async (customerId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }
};

export const rentalsAPI = {
  createRental: async (rentalData) => {
    const response = await fetch(`${API_BASE_URL}/rentals`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rentalData)
    });
    return handleResponse(response);
  },

  returnRental: async (rentalId) => {
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/return`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};

export default {
  filmsAPI,
  actorsAPI,
  customersAPI,
  rentalsAPI
};