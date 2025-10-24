import apiClient from './client';

// Get all vehicles with filters
export const getVehicles = async (filters = {}, category = null) => {
  try {
    const params = { ...filters };
    if (category) {
      params.category = category;
    }
    const response = await apiClient.get('/vehicles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

// Get single vehicle by ID
export const getVehicleById = async (id) => {
  try {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
};

// Get featured vehicles
export const getFeaturedVehicles = async () => {
  try {
    const response = await apiClient.get('/vehicles/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    throw error;
  }
};

// Submit buy now request
export const submitBuyRequest = async (data) => {
  try {
    const response = await apiClient.post('/orders/buy', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting buy request:', error);
    throw error;
  }
};

// Submit leasing request
export const submitLeasingRequest = async (data) => {
  try {
    const response = await apiClient.post('/orders/leasing', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting leasing request:', error);
    throw error;
  }
};

// Submit test drive booking
export const submitTestDrive = async (data) => {
  try {
    const response = await apiClient.post('/test-drives', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting test drive:', error);
    throw error;
  }
};

// Check VIN
export const checkVIN = async (vin) => {
  try {
    const response = await apiClient.get(`/vin-check/${vin}`);
    return response.data;
  } catch (error) {
    console.error('Error checking VIN:', error);
    throw error;
  }
};

// Get dealers
export const getDealers = async () => {
  try {
    const response = await apiClient.get('/dealers');
    return response.data;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    throw error;
  }
};

// Get dealer by ID
export const getDealerById = async (id) => {
  try {
    const response = await apiClient.get(`/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer:', error);
    throw error;
  }
};

// AI Chat
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await apiClient.post('/chat', {
      message,
      history: conversationHistory
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
