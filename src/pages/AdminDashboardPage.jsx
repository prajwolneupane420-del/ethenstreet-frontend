import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../components/AdminShell';
import { fetchSummary } from '../services/adminService';

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchSummary().then(setSummary).catch(() => setSummary({}));
  }, []);

  const cards = [
    { label: 'This Month Sales', value: `Rs. ${summary.monthSales || 0}`, to: '/admin/orders' },
    { label: 'Total Out of Stock', value: summary.outOfStock || 0, to: '/admin/products' },
    { label: 'Todays Orders', value: summary.todaysOrders || 0, to: '/admin/orders' },
    { label: 'Pending to Ship', value: summary.pendingToShip || 0, to: '/admin/orders' },
    { label: 'Ready to Ship', value: summary.readyToShip || 0, to: '/admin/orders' }
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="card p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-5 font-heading text-3xl font-bold text-brand-navy">{card.value}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
};

export default AdminDashboardPage;
