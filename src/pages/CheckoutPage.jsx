import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from "axios";
import { createOrder, validateCoupon } from '../services/orderService';

const CheckoutPage = () => {
  const { cart, session, setCart, refreshSession, flash } = useApp();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    name: session?.user?.name || '',
    phone: session?.user?.phone || '',
    line1: '',
    state: '',
    pinCode: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [popup, setPopup] = useState('');

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const shipping = coupon?.freeShipping ? 0 : 59;
  const discount = coupon ? Math.floor((subtotal * coupon.discountPercent) / 100) : 0;
  const total = subtotal - discount + shipping;

  // 🔥 Razorpay Payment
  const handlePayment = async () => {
    if (!address.name || !address.phone) {
      flash("Enter name and phone");
      return;
    }

    try {
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-order`,
        { amount: total }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Ethen Street",
        description: "Order Payment",
        order_id: order.id,

        // ✅ Autofill
        prefill: {
          name: address.name || session?.user?.name || "",
          email: session?.user?.email || "",
          contact: address.phone || "9999999999",
        },

        handler: async function (response) {
          try {
            const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify`,
              response
            );

            if (data.success) {
              await createOrder({
                items: cart,
                address,
                couponCode,
                paymentMethod: 'Prepaid',
                paymentId: response.razorpay_payment_id
              });

              setCart([]);
              await refreshSession();
              setPopup('THANK_YOU');

              setTimeout(() => {
                navigate('/profile');
              }, 1500);

            } else {
              setPopup('FAILED');
            }

          } catch (err) {
            console.error("Verify error:", err);
            setPopup('FAILED');
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          }
        },

        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        setPopup('FAILED');
      });

      rzp.open();

    } catch (error) {
      console.error("Payment init error:", error);
      flash("Payment failed to start");
    }
  };

  // 🔥 Coupon
  const applyCoupon = async () => {
    try {
      const data = await validateCoupon(couponCode);
      setCoupon(data);
      flash('Coupon applied');
    } catch {
      setCoupon(null);
      flash('Coupon invalid');
    }
  };

  // 🔥 Checkout
  const proceed = async () => {
    if (processing) return;
    setProcessing(true);

    if (!session) {
      setProcessing(false);
      return navigate('/auth');
    }

    if (!cart.length) {
      setProcessing(false);
      return flash('Your cart is empty');
    }

    if (!address.name || !address.phone || !address.line1 || !address.state || !address.pinCode) {
      setProcessing(false);
      return flash('Complete delivery details');
    }

    try {
      if (paymentMethod === 'COD') {
        await createOrder({
          items: cart,
          address,
          couponCode,
          paymentMethod: 'COD'
        });

        setCart([]);
        await refreshSession();
        setPopup('THANK_YOU');

      } else {
        await handlePayment();
      }

    } catch (error) {
      setPopup('FAILED');
      flash(error.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Secure Checkout</p>
  <h1 className="text-3xl font-bold text-brand-navy">Complete your order</h1>
  <p className="text-sm text-slate-500 mt-1">All transactions are secure and encrypted.</p>
</div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Address */}
        <div className="card p-4 space-y-3">
          <input className="field" placeholder="Name"
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })} />

          <input className="field" placeholder="Phone"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })} />

          <textarea className="field" placeholder="Address"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })} />

          <input className="field" placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })} />

          <input className="field" placeholder="PIN Code"
            value={address.pinCode}
            onChange={(e) => setAddress({ ...address, pinCode: e.target.value })} />
        </div>

        {/* Summary */}
        <div className="card p-5 space-y-4">
  <div className="text-xs text-slate-500 space-y-1">
  <p>🔒 Secure payments powered by Razorpay</p>
  <p>🚚 Fast delivery across India</p>
  <p>💳 COD & Prepaid available</p>
</div>
          <input className="field" placeholder="Coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />

          <button onClick={applyCoupon} className="btn-secondary mt-2 w-full">Apply</button>

          <p>Subtotal: ₹{subtotal}</p>
          <p>Discount: ₹{discount}</p>
          <p>Shipping: ₹{shipping}</p>
          <h3 className="font-bold text-lg">Total: ₹{total}</h3>

          <label>
            <input type="radio"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')} />
            COD
          </label>

          <label>
            <input type="radio"
              checked={paymentMethod === 'Prepaid'}
              onChange={() => setPaymentMethod('Prepaid')} />
            Online Payment
          </label>

          <button
            onClick={proceed}
            disabled={processing}
            className={`btn-primary w-full ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {popup === 'THANK_YOU' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="card p-6 text-center">
            <h2>Order Successful</h2>
            <button onClick={() => navigate('/profile')} className="btn-primary mt-4">
              Go to Profile
            </button>
          </div>
        </div>
      )}

      {/* Failed Popup */}
      {popup === 'FAILED' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="card p-6 text-center">
            <h2 className="text-red-600">Payment Failed</h2>
            <button onClick={() => setPopup('')} className="btn-secondary mt-4">
              Try Again
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutPage;