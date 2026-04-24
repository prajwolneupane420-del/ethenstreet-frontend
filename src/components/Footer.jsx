import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-14 border-t border-slate-200 bg-white/90">
    <div className="container-shell grid grid-cols-2 gap-4 py-6 text-sm md:grid-cols-4">
      <div>
        <h3 className="font-heading text-base font-bold text-brand-navy">Ethenstreet</h3>
        <p className="mt-1 text-xs text-slate-600">Streetwear built for anime and superhero culture.</p>
      </div>
      <div className="text-slate-600">
        <p className="font-semibold text-brand-ink">Contact</p>
        <p className="mt-2">ethenstreet@gmail.com</p>
        <p>+91 78380 35507</p>
      </div>
      <div className="text-slate-600">
        <p className="font-semibold text-brand-ink">Address</p>
        <p className="mt-2">A-57, Street No 3, Salarpur, Noida, Uttar Pradesh, India</p>
      </div>
      <div className="text-slate-600">
        <p className="font-semibold text-brand-ink">Return / Replace</p>
        <Link to="/returns/new" className="mt-2 inline-block text-brand-navy">Open Return Form</Link>
        <p className="mt-2 text-[10px]">© Ethenstreet 2019-Present.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
