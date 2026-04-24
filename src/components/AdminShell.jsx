import { Link, NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Returns', to: '/admin/returns' },
  { label: 'Coupons', to: '/admin/coupons' },
  { label: 'Featured Poster', to: '/admin/featured' }
];

const AdminShell = ({ title, action, children }) => (
  <div className="container-shell py-8">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <Link to="/" className="text-sm text-slate-500">Back to store</Link>
        <h1 className="mt-2 font-heading text-3xl font-bold text-brand-navy">{title}</h1>
      </div>
      {action}
    </div>
    <div className="mb-6 flex flex-wrap gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/admin'}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-brand-navy text-white' : 'bg-white text-brand-navy'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
    {children}
  </div>
);

export default AdminShell;
