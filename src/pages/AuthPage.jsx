import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser, verifyOtp } from '../services/authService';

const initialRegister = { name: '', email: '', phone: '', password: '', otp: '' };
const initialLogin = { identifier: '', password: '' };

const AuthPage = () => {
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loading, setLoading] = useState(false);
  const { setSession, flash } = useApp();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otp = await verifyOtp(registerForm.otp);
      if (!otp.verified) {
        throw new Error('Invalid OTP');
      }
      const data = await registerUser({ ...registerForm, otpVerified: true });
      setSession(data);
      flash('Welcome to Ethenstreet');
      navigate('/profile');
    } catch (error) {
      flash(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(loginForm);
      setSession(data);
      flash('Logged in successfully');
      navigate('/profile');
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-shell py-8">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-brand-navy p-8 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Ethenstreet Access</p>
          <h1 className="mt-3 font-heading text-4xl font-bold">Join the streetwear circuit.</h1>
          <p className="mt-4 max-w-md text-sm text-slate-200">Phone verification is required. Google login is kept ready as a placeholder for future auth upgrades.</p>
          <button className="mt-8 rounded-full bg-white px-5 py-3 font-semibold text-brand-navy">Continue with Google</button>
        </div>
        <div className="card p-6 sm:p-8">
          <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1">
            {['login', 'register'].map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${tab === value ? 'bg-brand-navy text-white' : 'text-slate-600'}`}
              >
                {value === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input className="field" placeholder="Phone or email" value={loginForm.identifier} onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })} required />
              <input className="field" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
              <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : 'Login'}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <input className="field" placeholder="Full name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required />
              <input className="field" placeholder="Email (optional)" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <input className="field" placeholder="Phone" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} required />
              <input className="field" type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
              <input className="field" placeholder="OTP (demo: any 6 digits)" value={registerForm.otp} onChange={(e) => setRegisterForm({ ...registerForm, otp: e.target.value })} required />
              <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : 'Create account'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
