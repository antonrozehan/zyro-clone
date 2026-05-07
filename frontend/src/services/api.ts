import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProducts = (params?: any) => API.get('/products/', { params });
export const getProduct = (id: number) => API.get(`/products/${id}/`);
export const getCategories = () => API.get('/categories/');
export const getFeatured = () => API.get('/featured/');
export const getRecommended = () => API.get('/recommended/');

export default API;
