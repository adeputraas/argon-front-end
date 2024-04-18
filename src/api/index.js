import axios from 'axios';

// Set default content type for POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json';

const BASE_URLS = {
  USERS: 'http://localhost:3030/',
  ABSENCE: 'http://localhost:3040/',
  NOTIFICATION: 'http://localhost:3050/',
};
const token = localStorage.getItem('token');

export default class API {
  // Get configuration with authorization token
  static getConfig = () => {
    return {
      headers: {
        Authorization: token,
      },
    };
  };

  // Make a POST request
  static post = async (service, endpoint, body, customHeaders) => {
    const config = {
      ...API.getConfig(),
      headers: {
        ...API.getConfig().headers,
        ...customHeaders,
      },
    };

    const url = `${BASE_URLS[service]}${endpoint}`;
    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  // Make a GET request
  static get = async (service, endpoint, params) => {
    const config = {
      ...API.getConfig(),
    };

    const url = `${BASE_URLS[service]}${endpoint}`;
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  static uploadFile = async (service, endpoint, file, additionalData) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const config = {
      ...API.getConfig(),
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
      },
  };
    const url = `${BASE_URLS[service]}${endpoint}`;
    try {
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error) {
      return error.response.data
    }
  };
}
