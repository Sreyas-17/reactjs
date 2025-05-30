import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  maxContentLength: 10 * 1024 * 1024, 
  maxBodyLength: 10 * 1024 * 1024
});


class AxiosService {
  async post(url, data) {
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async get(url) {
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data) {
    try {
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url) {
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new AxiosService();