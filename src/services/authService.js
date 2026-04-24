import api from './api';

export const verifyOtp = async (otp) => (await api.post('/auth/verify-otp', { otp })).data;
export const registerUser = async (payload) => (await api.post('/auth/register', payload)).data;
export const loginUser = async (payload) => (await api.post('/auth/login', payload)).data;
export const loginAdmin = async (payload) => (await api.post('/auth/admin/login', payload)).data;
export const getMe = async () => (await api.get('/auth/me')).data;
export const updateAddress = async (index, payload) =>
  (await api.put(`/auth/me/addresses/${index}`, payload)).data;
