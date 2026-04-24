import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchHomeHero, updateHomeHero } from '../services/productService';
import { useApp } from '../context/AppContext';

const AdminFeaturedPage = () => {
  const { flash } = useApp();
  const [form, setForm] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    badge: '',
    hotImageUrl: '',
    hotTitle: ''
  });

  useEffect(() => {
    fetchHomeHero().then(setForm).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await updateHomeHero(form);
      flash('Featured poster updated');
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to update featured poster');
    }
  };

  return (
    <AdminShell title="Featured Poster">
      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={submit} className="card space-y-4 p-6">
          <input className="field" placeholder="Poster image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <input className="field" placeholder="Badge text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          <input className="field" placeholder="Poster title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="field min-h-24" placeholder="Poster subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <input className="field" placeholder="Hot right now image URL" value={form.hotImageUrl} onChange={(e) => setForm({ ...form, hotImageUrl: e.target.value })} />
          <input className="field" placeholder="Hot right now title" value={form.hotTitle} onChange={(e) => setForm({ ...form, hotTitle: e.target.value })} />
          <button className="btn-primary w-full">Save featured poster</button>
        </form>
        <div className="card overflow-hidden">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Featured poster preview" className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center text-slate-400">Poster preview</div>
          )}
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{form.badge || 'Badge'}</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-brand-navy">{form.title || 'Poster title'}</h3>
            <p className="mt-2 text-sm text-slate-600">{form.subtitle || 'Poster subtitle'}</p>
            {form.hotImageUrl ? <img src={form.hotImageUrl} alt="Hot right now preview" className="mt-4 h-24 w-full rounded-xl object-cover" /> : null}
            <p className="mt-2 text-sm font-semibold text-brand-ink">{form.hotTitle || 'Hot right now title'}</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminFeaturedPage;
