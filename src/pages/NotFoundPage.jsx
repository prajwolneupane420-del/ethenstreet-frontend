import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="container-shell py-16 text-center">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">404</p>
    <h1 className="mt-3 font-heading text-4xl font-bold text-brand-navy">Page not found</h1>
    <Link to="/" className="btn-primary mt-6">Back Home</Link>
  </section>
);

export default NotFoundPage;
