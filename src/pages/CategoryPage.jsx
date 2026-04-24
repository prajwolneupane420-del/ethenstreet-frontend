import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FiltersBar from '../components/FiltersBar';
import Pagination from '../components/Pagination';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';
import MobileFilters from '../components/MobileFilters';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { fetchProducts } from '../services/productService';
import { Helmet } from "react-helmet-async";

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ filters defined BEFORE usage
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    q: searchParams.get('q') || '',
    page: 1
  });

  const [data, setData] = useState({
    items: [],
    pagination: { page: 1, pages: 1 }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const debouncedFilters = useDebounce(filters);

  // 🔥 Fetch products
  useEffect(() => {
    setLoadingProducts(true);

    fetchProducts({ ...debouncedFilters, limit: 10 })
      .then((res) => {
        setData({
          items: res.items || [],
          pagination: res.pagination || { page: 1, pages: 1 }
        });
        setLoadingProducts(false);
      })
      .catch(() => {
        setData({
          items: [],
          pagination: { page: 1, pages: 1 }
        });
        setLoadingProducts(false);
      });
  }, [debouncedFilters]);

  // 🔄 Sync URL → filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || ''
    }));
  }, [searchParams]);

  return (
    <>
      {/* ✅ SEO INSIDE COMPONENT */}
      <Helmet>
        <title>
          {filters.category
            ? `${filters.category} T-Shirts | Ethenstreet`
            : "Shop Streetwear | Ethenstreet"}
        </title>

        <meta
          name="description"
          content={`Buy ${filters.category || "streetwear"} under ₹${
            filters.maxPrice || "999"
          } at Ethenstreet.`}
        />
      </Helmet>

      <section className="container-shell py-8">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            All Products
          </p>
          <h1 className="font-heading text-3xl font-bold text-brand-navy">
            Streetwear categories
          </h1>
        </div>

        {/* Filter Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Products</h2>

          <button
            onClick={() => setShowFilters(true)}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Filters ⚙️
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FiltersBar
            filters={filters}
            setFilters={(newFilters) => {
              setFilters({ ...newFilters, page: 1 });

              setSearchParams({
                category: newFilters.category || "",
                maxPrice: newFilters.maxPrice || "",
                sort: newFilters.sort || "",
                q: newFilters.q || ""
              });
            }}
            showSearch={true}
          />
        </div>

        {/* Products */}
        <div className="mt-6">
          {loadingProducts ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : data.items.length > 0 ? (
            <ProductGrid products={data.items} />
          ) : (
            <p className="text-center text-slate-500">
              No products found
            </p>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          page={data.pagination.page}
          pages={data.pagination.pages}
          onChange={(page) =>
            setFilters((current) => ({ ...current, page }))
          }
        />

      </section>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showFilters && (
          <MobileFilters
            filters={filters}
            setFilters={(newFilters) => {
              setFilters({ ...newFilters, page: 1 });

              setSearchParams({
                category: newFilters.category || "",
                maxPrice: newFilters.maxPrice || "",
                sort: newFilters.sort || "",
                q: newFilters.q || ""
              });
            }}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryPage;