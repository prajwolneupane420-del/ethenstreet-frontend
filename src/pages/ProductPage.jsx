import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, fetchProducts } from "../services/productService";
import { useApp } from "../context/AppContext";
import { Helmet } from "react-helmet-async";


const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, increaseQty, decreaseQty, flash } = useApp();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

  // ✅ SAFE SLIDER FUNCTIONS
  const nextImage = () => {
  if (!product?.images?.length) return;
  setDirection(1);
  setSelectedImage((prev) =>
    prev === product.images.length - 1 ? 0 : prev + 1
  );
};

const prevImage = () => {
  if (!product?.images?.length) return;
  setDirection(-1);
  setSelectedImage((prev) =>
    prev === 0 ? product.images.length - 1 : prev - 1
  );
};

  const loadProduct = async () => {
    try {
      const data = await fetchProduct(slug);
      const item = data.product || data;
      setProduct(item);
      setSelectedSize(item.sizes?.[0] || null);
    } catch (err) {
      console.error("Error loading product", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
  if (!product?.images) return;

  product.images.forEach((img) => {
    const image = new Image();
    image.src = img;
  });
}, [product]);

  useEffect(() => {
    if (!product) return;

    fetchProducts({ category: product.category, limit: 8 })
    
      .then((res) => {
        const items = res.items || [];
        setSuggestions(items.filter((p) => p._id !== product._id));
      })
      .catch(() => setSuggestions([]));
  }, [product]);

  if (loading) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">
        Product not found
      </div>
    );
  }
  const cartItem = cart.find(
  (item) =>
    item.productId === product._id && item.size === selectedSize
);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{product.name} | Buy Online at Ethenstreet</title>
        <meta
          name="description"
          content={
            product.description?.slice(0, 150) ||
            `Buy ${product.name} at best price`
          }
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images?.[0]} />
        <link
          rel="canonical"
          href={`${window.location.origin}/product/${product.slug}`}
        />
      </Helmet>

      <div className="container-shell py-10 pb-24 md:pb-16 grid md:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* IMAGES */}
        <div className="grid gap-4 md:grid-cols-[100px_1fr]">

          {/* THUMBNAILS */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  selectedImage === i ? "border-black" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* MAIN IMAGE + SLIDER */}
<div className="relative w-full aspect-square overflow-hidden">

  <motion.img
  key={selectedImage}
  src={product.images[selectedImage]}
  alt={product.name}
  className="w-full h-full object-cover"

  initial={{ x: direction === 1 ? 40 : -40, opacity: 0.6 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.18 }}

  drag={!fullscreen ? "x" : false}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.6}

  onClick={() => {
    if (isMobile) setFullscreen(true);
  }}

  onDragEnd={(e, info) => {
    if (fullscreen) return;
    if (info.velocity.x > 500 || info.offset.x > 80) prevImage();
    if (info.velocity.x < -500 || info.offset.x < -80) nextImage();
  }}
/>

  {/* LEFT */}
  {product.images?.length > 1 && (
    <button
      onClick={prevImage}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
    >
      ‹
    </button>
  )}

  {/* RIGHT */}
  {product.images?.length > 1 && (
    <button
      onClick={nextImage}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
    >
      ›
    </button>
  )}

</div>

          {/* DOTS */}
          {product.images?.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-2 w-2 rounded-full cursor-pointer ${
                    i === selectedImage ? "bg-brand-navy" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {product.category}
          </p>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-navy mt-2">
            {product.name}
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-brand-navy mt-4">
            ₹{product.price ?? "—"}
          </p>

          {/* SIZES */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-semibold">Select Size:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      selectedSize === size
                        ? "bg-brand-navy text-white border-brand-navy"
                        : "bg-white text-black hover:border-brand-navy"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

         {!isMobile && (
  <>
    <AnimatePresence mode="wait">

{cartItem ? (
  <motion.div
    key="qty"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="mt-6 flex items-center justify-between w-full max-w-xs border rounded-full overflow-hidden"
  >

    <button
      onClick={() => decreaseQty(product._id, selectedSize)}
      className="px-4 py-2 text-lg"
    >
      −
    </button>

    <motion.span
  key={cartItem.quantity}
  initial={{ scale: 1.2 }}
  animate={{ scale: 1 }}
  className="px-4 font-semibold text-lg"
/>

    <button
      onClick={() => increaseQty(product._id, selectedSize)}
      disabled={cartItem.quantity >= 8}
      className="px-4 py-2 text-lg"
    >
      +
    </button>

  </motion.div>
) : (
  <motion.button
    key="add"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={() => {
      if (!selectedSize) return;
      addToCart(product, selectedSize);
    }}
    className="mt-6 w-full py-3 rounded-full bg-brand-navy text-white font-semibold"
  >
    Add to Cart
  </motion.button>
)}

</AnimatePresence>

        {/* BUY NOW */}
        <button
          onClick={() => {
            if (!selectedSize) return;
            addToCart(product, selectedSize);
            navigate("/cart");
          }}
          disabled={!selectedSize || product.stock <= 0}
          className="mt-3 w-full py-3 rounded-full border border-brand-navy text-brand-navy font-semibold hover:bg-brand-navy hover:text-white"
        >
          Buy Now
        </button>
      </>
    )}


          {/* TRUST */}
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p>✔ 100% Original Product</p>
            <p>✔ Easy Returns & Exchanges</p>
            <p>✔ Cash on Delivery Available</p>
          </div>

          {/* DETAILS */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex justify-between font-semibold text-brand-navy"
            >
              <span>Product Details</span>
              <span>{showDetails ? "−" : "+"}</span>
            </button>

            {showDetails && product.description && (
              <div className="mt-3 text-sm text-slate-600">
                <p>
                  {expanded
                    ? product.description
                    : product.description
                        .split(" ")
                        .slice(0, 40)
                        .join(" ") + "..."}
                </p>

                {product.description.split(" ").length > 40 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-brand-navy font-semibold"
                  >
                    {expanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

{/* YOU MAY ALSO LIKE */}
{suggestions.length > 0 && (
  <div className="container-shell mt-6 border-t border-slate-200 pt-6 pb-24 md:pb-0">

    <h2 className="text-lg font-semibold mb-4">
      You may also like
    </h2>

    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">

      {suggestions.map((item) => (
        <div
          key={item._id}
          onClick={() => navigate(`/product/${item.slug}`)}
          className="min-w-[150px] max-w-[150px] cursor-pointer snap-start"
        >
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition active:scale-95">

            <img
              src={item.images?.[0]}
              className="w-full h-36 object-cover"
              alt={item.name}
            />

            <div className="p-2">
              <p className="text-xs font-medium line-clamp-1">
                {item.name}
              </p>
              <p className="text-sm font-semibold mt-1">
                ₹{item.price}
              </p>
            </div>

          </div>
        </div>
      ))}

    </div>
  </div>
)}

{fullscreen && (
  <div
  onClick={() => setFullscreen(false)}
  className="fixed inset-0 bg-black z-50 flex items-center justify-center"
>

    <motion.img
  key={selectedImage}
  src={product.images[selectedImage]}
  onClick={(e) => e.stopPropagation()}
  className="max-h-full max-w-full object-contain"

  initial={{ x: direction === 1 ? 120 : -120, opacity: 0.5 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.25 }}

  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.6}

  onDragEnd={(e, info) => {
    if (info.velocity.x > 500 || info.offset.x > 80) prevImage();
    if (info.velocity.x < -500 || info.offset.x < -80) nextImage();
  }}
/>

    <button
      onClick={() => setFullscreen(false)}
      className="absolute top-4 right-4 text-white text-2xl"
    >
      ✕
    </button>

  </div>
)}
{/* STICKY ACTION BAR (MOBILE) */}
{isMobile && (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-3 z-40">

    {/* 🔥 ONLY THIS PART CHANGED */}
    {cartItem ? (
      <div className="flex-1 flex items-center justify-between border rounded-full overflow-hidden">

        <button
          onClick={() => decreaseQty(product._id, selectedSize)}
          className="px-4 py-2 text-lg font-semibold"
        >
          −
        </button>

        <span className="px-4 font-semibold text-lg">
          {cartItem.quantity}
        </span>

        <button
          onClick={() => increaseQty(product._id, selectedSize)}
          disabled={cartItem.quantity >= 8}
          className={`px-4 py-2 text-lg font-semibold ${
            cartItem.quantity >= 8 ? "opacity-40" : ""
          }`}
        >
          +
        </button>

      </div>
    ) : (
      <button
        onClick={() => {
          if (!selectedSize) return;
          addToCart(product, selectedSize);
          flash("Added to cart");
        }}
        disabled={!selectedSize || product.stock <= 0}
        className="flex-1 py-3 rounded-full bg-brand-navy text-white font-semibold"
      >
        Add to Cart
      </button>
    )}

    {/* ✅ KEEP THIS EXACTLY SAME */}
    <button
      onClick={() => {
        if (!selectedSize) return;
        addToCart(product, selectedSize);
        navigate("/cart");
      }}
      disabled={!selectedSize || product.stock <= 0}
      className="flex-1 py-3 rounded-full border border-brand-navy text-brand-navy font-semibold"
    >
      Buy Now
    </button>

  </div>
)}
    </>
  );
};

export default ProductPage;