import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchAdminReturns, updateReturnStatus } from '../services/adminService';
import { useApp } from '../context/AppContext';

const AdminReturnsPage = () => {
  const [requests, setRequests] = useState([]);
  const { flash } = useApp();

  const load = () => fetchAdminReturns().then(setRequests).catch(() => setRequests([]));

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    await updateReturnStatus(id, status);
    flash('Return updated');
    load();
  };

  return (
    <AdminShell title="Returns">
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-brand-ink">{request.user?.name} - {request.user?.phone}</p>
                <p>Order #{request.order?._id?.slice(-6)}</p>
                <p>Reason: {request.reason || '-'}</p>
                <p>Contact: {request.contactName || '-'} ({request.contactPhone || '-'})</p>
                <p>Email: {request.contactEmail || '-'}</p>
                <p>Pickup address: {request.pickupAddress || '-'}</p>
                <p>Notes: {request.additionalNotes || '-'}</p>
              </div>
              <select className="field min-w-40" value={request.status} onChange={(e) => changeStatus(request._id, e.target.value)}>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        ))}
        {!requests.length && <div className="card p-8 text-center text-slate-500">No return requests found.</div>}
      </div>
    </AdminShell>
  );
};

export default AdminReturnsPage;
