import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginAdmin } from '../services/authService';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setSession, flash } = useApp();
  const navigate = useNavigate();

 const submit = async (e) => {
  e.preventDefault();
  try {
    const data = await loginAdmin(form);

    // 🔥 ROLE CHECK HERE
    if (data.user?.role !== "admin") {
      flash("Access denied. Not an admin.");
      return;
    }

    setSession(data);
    navigate("/admin");
  } catch (error) {
    flash(error.response?.data?.message || "Admin login failed");
  }
};

  return (
    <section className="container-shell py-12">
      <div className="mx-auto max-w-md card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin Access</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-brand-navy">Ethenstreet dashboard</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="field" type="email" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn-primary w-full">Login</button>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;
