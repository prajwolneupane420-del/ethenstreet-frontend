import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getMe } from '../services/authService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [session, setSession] = useLocalStorage('ethenstreet-user', null);

  // ✅ FIXED: cart added back
  const [cart, setCart] = useLocalStorage('ethenstreet-cart', []);

  // ✅ wishlist
  const [wishlist, setWishlist] = useLocalStorage('ethenstreet-wishlist', []);

  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔥 Refresh session
  const refreshSession = async () => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    try {
      const user = await getMe();
      setSession((current) => (current ? { ...current, user } : current));
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, [session?.token]);

  // 🔔 Toast
  const flash = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  // 🛒 Cart Functions
 // 🛒 Cart Functions

const addToCart = (product, size = "default") => {
  setCart((current) => {
    const index = current.findIndex(
      (item) => item.productId === product._id && item.size === size
    );

    if (index > -1) {
      const next = [...current];
      next[index].quantity = Math.min(next[index].quantity + 1, 8);
      return next;
    }

    return [
      ...current,
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size,
        quantity: 1,
      },
    ];
  });

  flash('Successfully added to bag');
};

const updateCartQuantity = (productId, size, quantity) => {
  if (quantity < 1) {
    return setCart((current) =>
      current.filter(
        (item) =>
          !(item.productId === productId && item.size === size)
      )
    );
  }

  const safeQty = Math.min(quantity, 8);

  setCart((current) =>
    current.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity: safeQty }
        : item
    )
  );
};

const increaseQty = (productId, size) => {
  setCart((current) =>
    current.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity: Math.min(item.quantity + 1, 8) }
        : item
    )
  );
};

const decreaseQty = (productId, size) => {
  setCart((current) =>
    current
      .map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};

const removeFromCart = (productId, size) => {
  setCart((current) =>
    current.filter(
      (item) =>
        !(item.productId === productId && item.size === size)
    )
  );
};
  // ❤️ Wishlist Function (clean)
  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.find((item) => item._id === product._id);

      if (exists) {
        return current.filter((item) => item._id !== product._id);
      }

      return [...current, product];
    });
  };

  return (
    <AppContext.Provider
      value={{
  session,
  setSession,
  refreshSession,

  cart,
  setCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  increaseQty,
  decreaseQty,

  wishlist,
  setWishlist,
  toggleWishlist,

  toast,
  flash,
  loading,
}}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);