import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createReturn, fetchMyOrders } from '../services/orderService';

const ReturnOrderPage = () => {
  const { flash } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: '',
    reason: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    pickupAddress: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchMyOrders()
      .then((data) => {
        setOrders(data);
        const queryOrderId = searchParams.get('orderId') || '';
        setForm((prev) => ({ ...prev, orderId: queryOrderId || data[0]?._id || '' }));
      })
      .catch(() => setOrders([]));
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createReturn(form);
      flash('Return request submitted');
      navigate('/profile');
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to submit return request');
    }
  };

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Return Order Form</p>
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Create return request</h1>
      </div>
      <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-4 p-6">
        <select className="field" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} required>
          <option value="">Select order</option>
          {orders.map((order) => (
            <option key={order._id} value={order._id}>
              Order #{order._id.slice(-6)} - Rs. {order.totals?.total}
            </option>
          ))}
        </select>
        <input className="field" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
        <input className="field" placeholder="Contact name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
        <input className="field" placeholder="Contact phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required />
        <input className="field" type="email" placeholder="Contact email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        <textarea className="field min-h-24" placeholder="Pickup address" value={form.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} required />
        <textarea className="field min-h-20" placeholder="Additional notes" value={form.additionalNotes} onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })} />
        <button className="btn-primary w-full">Submit return request</button>
      </form>
    </section>
  );
};

export default ReturnOrderPage;
