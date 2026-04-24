import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toast } = useApp();
  return toast ? (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-soft">
      {toast}
    </div>
  ) : null;
};

export default Toast;
