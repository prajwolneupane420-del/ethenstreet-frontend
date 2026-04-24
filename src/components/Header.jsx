import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { navLinks } from '../utils/constants';
import { useApp } from '../context/AppContext';



const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop';
  const { cart, wishlist } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = location.pathname.startsWith('/admin');
  const [activeTab, setActiveTab] = useState("home");
  const showTabs =
  location.pathname === "/" || location.pathname === "/shop";
  
  
  useEffect(() => {
  if (location.pathname === "/shop") {
    setActiveTab("shop");
  } else {
    setActiveTab("home");
  }
}, [location.pathname]);

  useEffect(() => {
    if (isShop) {
      setSearchText(searchParams.get('q') || '');
    } else {
      setSearchOpen(false);
      setSearchText('');
    }
  }, [isShop, searchParams]);

  useEffect(() => {
  if (searchOpen) {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }
}, [searchOpen]);

  const applySearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchText.trim()) {
      params.set('q', searchText.trim());
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <header className="border-b border-slate-200/60 bg-white/85">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        {isHome ? (
  <Link to="/" className="min-w-0">
    <div className="font-heading text-2xl font-extrabold text-brand-navy">Ethenstreet</div>
    <p className="truncate text-xs text-slate-500">Streetwear coded for the next drop.</p>
  </Link>
) : (
  <button
  onClick={() => navigate(-1)}
  className="icon-btn md:hidden"
>
  <ArrowLeft size={18} />
</button>
)}
        <div className="flex items-center gap-3">

  {/* 🔍 EXISTING SEARCH / NAV stays same */}

  {isShop && (
    <div className="relative flex items-center">

  {/* 🔥 SLIDING INPUT */}
  <div
    className={`absolute right-10 transition-all duration-300 ease-out ${
      searchOpen
        ? "opacity-100 translate-x-0 w-52"
        : "opacity-0 translate-x-6 w-0 pointer-events-none"
    }`}
  >
    <input
      ref={inputRef}
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && applySearch()}
      className="field w-full"
      placeholder="Search drops"
    />
  </div>

  {/* 🔍 ICON BUTTON */}
  <button
    onClick={() => {
      if (searchOpen) {
        applySearch();
      }
      setSearchOpen((prev) => !prev);
    }}
    className="icon-btn relative z-10"
  >
    <Search size={18} />
  </button>

</div>
  )}
  <Link to="/wishlist" className="icon-btn relative">
  <Heart size={18} />

  {wishlist.length > 0 && (
    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
      {wishlist.length}
    </span>
  )}
</Link>
    {/* 🛒 CART BUTTON (NEW) */}
  {!isAdmin && (
  <Link to="/cart" className="icon-btn relative">
  <ShoppingCart size={18} />

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {cartCount}
      </span>
    )}
  </Link>
  
)}
<Link to="/profile" className="icon-btn">
  <User size={18} />
</Link>
        
            <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? 'text-brand-navy' : 'text-slate-600')}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
      
        </div>
      </div>
       {showTabs && (
  <div className="container-shell md:hidden pb-3">
    <div className="relative flex bg-slate-100 rounded-full p-1">

      <div
        className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow transition-transform duration-300 ease-out ${
          activeTab === "shop" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <button
        onClick={() => {
          setActiveTab("home");
          navigate("/");
        }}
        className={`relative z-10 flex-1 py-2 text-sm font-semibold ${
          activeTab === "home"
            ? "text-brand-navy"
            : "text-slate-500"
        }`}
      >
        Featured
      </button>

      <button
        onClick={() => {
          setActiveTab("shop");
          navigate("/shop");
        }}
        className={`relative z-10 flex-1 py-2 text-sm font-semibold ${
          activeTab === "shop"
            ? "text-brand-navy"
            : "text-slate-500"
        }`}
      >
        Products
      </button>

    </div>
  </div>
)}
  
    </header>
  );
};

export default Header;
