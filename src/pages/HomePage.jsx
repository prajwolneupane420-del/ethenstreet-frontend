import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { fetchFeaturedProducts } from '../services/productService';
import { priceFilters } from '../utils/constants';
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchFeaturedProducts();
        setProducts(data.products || data);
      } catch (error) {
        console.error("Failed to load featured products", error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Ethenstreet | Streetwear & Anime Clothing</title>
<link rel="canonical" href={window.location.origin} />
        <meta
          name="description"
          content="Shop premium anime & streetwear clothing online at Ethenstreet. Latest drops, best prices, fast delivery."
        />

        <meta property="og:title" content="Ethenstreet Store" />
        <meta property="og:description" content="Premium anime & streetwear collection" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div>
        <Hero />

        <section className="container-shell mt-12">
          <div className="mb-6 flex flex-wrap gap-3">
            {priceFilters.map((price) => (
              <Link
                key={price}
                to={`/shop?maxPrice=${price}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-navy"
              >
                Under Rs. {price}
              </Link>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Featured
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-navy">
              Best-selling drops
            </h2>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </>
  );
};

export default HomePage;