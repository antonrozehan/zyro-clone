import axios from 'axios';
import { cache } from '../utils/cache';

const API_URL = 'http://localhost:8000/api';

export const preloadData = async () => {
  try {
    // Предзагружаем основные данные
    const [productsRes, recommendationsRes, categoriesRes] = await Promise.all([
      axios.get(`${API_URL}/products/`),
      axios.get(`${API_URL}/recommended/`),
      axios.get(`${API_URL}/categories/`)
    ]);
    
    cache.set('products_all', productsRes.data);
    cache.set('recommended', recommendationsRes.data);
    cache.set('categories', categoriesRes.data);
    
    console.log('Data preloaded successfully');
  } catch (error) {
    console.error('Error preloading data:', error);
  }
};
