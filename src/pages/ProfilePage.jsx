import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateAddress } from '../services/authService';
import { fetchMyOrders, fetchReturns } from '../services/orderService';

const ProfilePage = () => {
  const { session, refreshSession, setSession, flash } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const [addressDraft, setAddressDraft] = useState({ name: '', line1: '', state: '', pinCode: '', phone: '' });

 useEffect(() => {
  if (!session) {
    navigate('/auth');
    return;
  }

  fetchMyOrders()
    .then(setOrders)
    .catch(() => setOrders([]));

  fetchReturns()
    .then(setReturns)
    .catch(() => setReturns([]));

}, [session?._id]);

  const requestReturn = async (orderId) => {
    navigate(`/returns/new?orderId=${orderId}`);
  };

  const startEditAddress = (index, address) => {
    setEditingAddressIndex(index);
    setAddressDraft(address);
  };

  const saveAddress = async () => {
    try {
      await updateAddress(editingAddressIndex, addressDraft);
      await refreshSession();
      flash('Address updated');
      setEditingAddressIndex(-1);
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to update address');
    }
  };

  if (!session) {
    return null;
  }

  return (
    <section className="container-shell py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Your Profile</p>
          <h1 className="font-heading text-3xl font-bold text-brand-navy">{session.user.name}</h1>
        </div>
        <button className="btn-secondary" onClick={() => setSession(null)}>Logout</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="card p-6">
          <h2 className="font-heading text-xl font-bold text-brand-navy">Saved addresses</h2>
          <div className="mt-4 space-y-3">
            {session.user.addresses?.length ? (
              session.user.addresses.map((address, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {editingAddressIndex === index ? (
                    <div className="space-y-2">
                      <input className="field" value={addressDraft.name} onChange={(e) => setAddressDraft({ ...addressDraft, name: e.target.value })} />
                      <input className="field" value={addressDraft.line1} onChange={(e) => setAddressDraft({ ...addressDraft, line1: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="field" value={addressDraft.state} onChange={(e) => setAddressDraft({ ...addressDraft, state: e.target.value })} />
                        <input className="field" value={addressDraft.pinCode} onChange={(e) => setAddressDraft({ ...addressDraft, pinCode: e.target.value })} />
                      </div>
                      <input className="field" value={addressDraft.phone} onChange={(e) => setAddressDraft({ ...addressDraft, phone: e.target.value })} />
                      <div className="flex gap-2">
                        <button className="btn-primary px-4 py-2 text-xs" onClick={saveAddress}>Save</button>
                        <button className="btn-secondary px-4 py-2 text-xs" onClick={() => setEditingAddressIndex(-1)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-brand-ink">{address.name}</p>
                      <p>{address.line1}</p>
                      <p>{address.state} - {address.pinCode}</p>
                      <p>{address.phone}</p>
                      <button className="mt-2 text-xs font-semibold text-brand-navy" onClick={() => startEditAddress(index, address)}>Edit address</button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Saved addresses appear after your first order.</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold text-brand-navy">Order history</h2>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-ink">{order.items.map((item) => item.name).join(', ')}</p>
                      <p className="text-sm text-slate-500">{order.status} - {order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-brand-navy">Rs. {order.totals.total}</p>
                      <button onClick={() => requestReturn(order._id)} className="mt-2 text-sm font-semibold text-brand-navy">
                        Return request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!orders.length && <p className="text-sm text-slate-500">No confirmed orders yet.</p>}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold text-brand-navy">Return requests</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {returns.map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-brand-ink">Order #{item.order?._id?.slice(-6)}</p>
                  <p className="mt-1">{item.status}</p>
                </div>
              ))}
              {!returns.length && <p>No return requests yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
