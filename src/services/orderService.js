import api from './api';

export const createOrder = async (payload) => (await api.post('/orders', payload)).data;
export const verifyPayment = async (payload) => (await api.post('/orders/verify-payment', payload)).data;
export const fetchMyOrders = async () => (await api.get('/orders/mine')).data;
export const validateCoupon = async (code) => (await api.get(`/coupons/${code}`)).data;
export const createReturn = async (payload) => (await api.post('/returns', payload)).data;
export const fetchReturns = async () => (await api.get('/returns/mine')).data;
