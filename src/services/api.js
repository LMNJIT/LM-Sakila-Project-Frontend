const API_BASE_URL = 'http://localhost:5001/api';

// Old approach - was trying to handle different error formats initially
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
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const filmsAPI = {
  getAllFilms: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/films?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  getTopRented: async () => {
    const response = await fetch(`${API_BASE_URL}/films/top-rented`);
    return handleResponse(response);
  },

  getFilmById: async (filmId) => {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}`);
    return handleResponse(response);
  },

  searchFilms: async (query, type = 'title') => {
    const response = await fetch(`${API_BASE_URL}/films/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
    return handleResponse(response);
  }
};

export const actorsAPI = {
  getTopActors: async () => {
    const response = await fetch(`${API_BASE_URL}/actors/top`);
    return handleResponse(response);
  },

  getActorById: async (actorId) => {
    const response = await fetch(`${API_BASE_URL}/actors/${actorId}`);
    return handleResponse(response);
  }
};

export const customersAPI = {
  getCustomers: async (page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  searchCustomers: async (query) => {
    const response = await fetch(`${API_BASE_URL}/customers/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  }
};

export default {
  filmsAPI,
  actorsAPI,
  customersAPI
};

// TODO: add error logging/monitoring service when we expand this
