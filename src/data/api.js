import axios from 'axios';

let token = localStorage.getItem('token');
let refreshToken = localStorage.getItem('refresh_token');

const api = axios.create({
  baseURL: "https://api-maja.herokuapp.com/v1/"
});

if (token) {
  api.defaults.headers.common['Authorization'] = `${token}`;
};

api.interceptors.response.use((res) => {
  return res;
}, async (err) => {
  const originalRequest = err.config;
  if (err.config.url != '/refreshToken' && err.response.status === 401 && originalRequest._retry !== true) {
    originalRequest._retry = true;
    if (refreshToken && refreshToken != '') {
      api.defaults.headers.common['Authorization'] = `${refreshToken}`;
      await api.post('/refreshToken')
        .then((res) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          localStorage.setItem('token', res.data.access_token);
        })
        .catch((err) => {
          refreshToken = null;
        });
      return api(originalRequest);
    }else{
      throw err;
    };
  }else{
    throw err;
  };
});

export default api;