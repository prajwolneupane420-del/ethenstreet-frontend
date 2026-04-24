import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { useApp } from '../context/AppContext';
import { exportOrdersSheet, fetchAdminOrders, updateOrderStatus } from '../services/adminService';

const AdminOrdersPage = () => {
  const [filters, setFilters] = useState({ date: '', status: '' });
  const [orders, setOrders] = useState([]);
  const { flash } = useApp();

  const load = () => fetchAdminOrders(filters).then(setOrders).catch(() => setOrders([]));

  useEffect(() => {
    load();
  }, [filters.date, filters.status]);

  const handleExport = async () => {
    try {
      const blob = await exportOrdersSheet();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ethenstreet-orders.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      flash('Export failed');
    }
  };

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    flash('Order status updated');
    load();
  };

  return (
    <AdminShell title="Orders" action={<button onClick={handleExport} className="btn-primary">Export to Excel</button>}>
      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-3">
        <input type="date" className="field" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <select className="field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Ready to Ship</option>
          <option>Shipped</option>
        </select>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-ink">{order.address.name} • {order.address.phone}</p>
                <p className="mt-1 text-sm text-slate-500">{order.items.map((item) => `${item.name} (${item.size})`).join(', ')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-brand-navy">Rs. {order.totals.total}</p>
                <select className="field min-w-40" value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                  <option>Pending</option>
                  <option>Ready to Ship</option>
                  <option>Shipped</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {!orders.length && <div className="card p-8 text-center text-slate-500">No confirmed orders found.</div>}
      </div>
    </AdminShell>
  );
};

export default AdminOrdersPage;
