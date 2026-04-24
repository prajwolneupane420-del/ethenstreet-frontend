import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchProducts } from '../services/productService';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, flash } = useApp();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const totalItems = useMemo(
  () => cart.reduce((sum, item) => sum + item.quantity, 0),
  [cart]
  );

  useEffect(() => {
    fetchProducts({ limit: 8 })
      .then((data) => {
        const cartIds = new Set(cart.map((item) => item.productId));
        const products = data.products || data;
setSuggestions(products.filter((item) => !cartIds.has(item._id)).slice(0, 4));
      })
      .catch(() => setSuggestions([]));
  }, [cart]);

  const moveToCheckout = () => {
     console.log("Inside moveToCheckout");
    if (!cart.length) {
      flash('Your cart is empty');
      return;
    }
      console.log("Navigating to checkout...");
    navigate('/checkout');
  };

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Your Cart</p>
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Review your items</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="card flex gap-4 p-4 rounded-2xl hover:shadow-lg transition">
              <img src={item.image} alt={item.name} className="h-24 w-20 rounded-xl object-cover border" />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Size {item.size}</p>
                <p className="mt-2 font-semibold text-brand-navy">Rs. {item.price}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="rounded-full bg-brand-mist px-3 py-1 hover:bg-brand-navy hover:text-white transition" onClick={() =>
  updateCartQuantity(
    item.productId,
    item.size,
    Math.max(1, item.quantity - 1)
  )
}>-</button>
                  <span>{item.quantity}</span>
                  <button className="rounded-full bg-slate-100 px-3 py-1" onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
                  <button className="ml-auto text-sm text-red-500 hover:underline" onClick={() => removeFromCart(item.productId, item.size)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {!cart.length && (
  <div className="card p-10 text-center">
    <p className="text-lg font-semibold">Your cart is empty</p>
    <p className="text-sm text-slate-500 mt-2">
      Looks like you haven't added anything yet.
    </p>
    <Link to="/" className="mt-4 inline-block btn-primary">
      Continue Shopping
    </Link>
  </div>
)}
        </div>
        <div className="space-y-4">
          <div className="card p-5 rounded-2xl space-y-3">
            <h2 className="font-heading text-xl font-bold text-brand-navy">Order summary</h2>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
  <div className="flex justify-between">
    <span>Total items</span>
    <span>{totalItems}</span>
  </div>

  <div className="flex justify-between">
    <span>Total product value</span>
    <span>Rs. {subtotal}</span>
  </div>
</div>
            <button
  onClick={() => {
    console.log("Checkout clicked");
    moveToCheckout();
  }} disabled={!cart.length} className={`mt-6 w-full btn-primary ${
  !cart.length ? "opacity-50 cursor-not-allowed" : ""
}`}>
              Proceed to Checkout
            </button>
          </div>
          <div className="card p-5">
            <h3 className="font-heading text-lg font-bold text-brand-navy">You may also like</h3>
            <div className="mt-4 space-y-3">
              {suggestions.map((item) => (
                <Link key={item._id} to={`/product/${item.slug}`} className="flex items-center gap-3">
                  <img src={item.images?.[0]} alt={item.name} className="h-16 w-14 rounded-xl object-cover" />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-brand-ink">{item.name}</p>
                    <p className="text-xs text-slate-500">Rs. {item.price}</p>
                  </div>
                </Link>
              ))}
              {!suggestions.length && <p className="text-sm text-slate-500">No suggestions right now.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
