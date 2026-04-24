import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { createCoupon, fetchCoupons } from '../services/adminService';
import { useApp } from '../context/AppContext';

const emptyForm = { code: '', discountPercent: 10, freeShipping: false, expiresAt: '' };

const AdminCouponsPage = () => {
  const { flash } = useApp();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = () => fetchCoupons().then(setCoupons).catch(() => setCoupons([]));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        ...form,
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent)
      });
      flash('Coupon created');
      setForm(emptyForm);
      load();
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to create coupon');
    }
  };

  return (
    <AdminShell title="Coupons">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={submit} className="card space-y-4 p-6">
          <input className="field" placeholder="Coupon code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          <input className="field" placeholder="Discount %" type="number" min={1} max={90} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} required />
          <input className="field" type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={form.freeShipping} onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })} />
            Free shipping
          </label>
          <button className="btn-primary w-full">Create coupon</button>
        </form>
        <div className="card overflow-auto p-4">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Shipping</th>
                <th className="px-4 py-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{coupon.code}</td>
                  <td className="px-4 py-3">{coupon.discountPercent}%</td>
                  <td className="px-4 py-3">{coupon.freeShipping ? 'Free' : 'Paid'}</td>
                  <td className="px-4 py-3">{new Date(coupon.expiresAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminCouponsPage;
