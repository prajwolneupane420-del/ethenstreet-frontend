import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useApp();

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const defaultSize = product.sizes?.[0];

  return (
    <article className="card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      <Link to={`/product/${product.slug}`} className="block">
        
        {/* IMAGE CONTAINER */}
        <div className="aspect-[4/5] bg-brand-mist overflow-hidden relative">

          {/* ❤️ BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition z-10"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

          {/* IMAGE */}
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </div>

      </Link>

      {/* CONTENT */}
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            {product.category}
          </p>

          <Link
            to={`/product/${product.slug}`}
            className="mt-1 block truncate font-semibold hover:underline"
          >
            {product.name}
          </Link>
        </div>

        <div>
          <span className="font-heading text-xl font-bold text-brand-navy">
            Rs. {product.price ?? "—"}
          </span>

          <button
            onClick={() => defaultSize && addToCart(product, defaultSize)}
            disabled={!defaultSize || product.stock <= 0}
            className={`mt-3 w-full rounded-full px-4 py-2 text-sm font-semibold text-white transition 
              ${
                !defaultSize || product.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-navy hover:scale-[1.02]"
              }`}
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
          </button>
        </div>
      </div>

    </article>
  );
};

export default ProductCard;