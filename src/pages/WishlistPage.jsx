import { useApp } from "../context/AppContext";
import ProductGrid from "../components/ProductGrid";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist } = useApp();

  return (
    <div className="container-shell py-10">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist ❤️</h1>

      {wishlist.length ? (
        <ProductGrid products={wishlist} />
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Your wishlist is empty</p>
          <p className="text-sm text-slate-500 mt-2">
            Start adding products you love ❤️
          </p>
          <Link to="/" className="mt-4 inline-block btn-primary">
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;