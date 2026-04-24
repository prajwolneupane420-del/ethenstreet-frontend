import api from './api';

export const fetchProducts = async (params) => {
  const { data } = await api.get('/products', { params });
  return data;
};
export const fetchFeaturedProducts = async () => (await api.get('/products/featured')).data;
export const fetchProduct = async (slug) => (await api.get(`/products/${slug}`)).data;
export const createProduct = async (payload) => (await api.post('/products', payload)).data;
export const updateProduct = async (id, payload) => (await api.put(`/products/${id}`, payload)).data;
export const fetchHomeHero = async () => (await api.get('/products/home-hero')).data;
export const updateHomeHero = async (payload) => (await api.put('/products/home-hero/content', payload)).data;
