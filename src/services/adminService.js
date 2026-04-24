import api from './api';

export const fetchSummary = async () => (await api.get('/admin/summary')).data;
export const fetchAdminOrders = async (params) => (await api.get('/admin/orders', { params })).data;
export const updateOrderStatus = async (id, status) =>
  (await api.put(`/admin/orders/${id}`, { status })).data;
export const exportOrdersSheet = async () =>
  (await api.get('/admin/orders/export/xlsx', { responseType: 'blob' })).data;
export const fetchCoupons = async () => (await api.get('/coupons')).data;
export const createCoupon = async (payload) => (await api.post('/coupons', payload)).data;
export const fetchAdminReturns = async () => (await api.get('/returns')).data;
export const updateReturnStatus = async (id, status) =>
  (await api.put(`/returns/${id}`, { status })).data;
