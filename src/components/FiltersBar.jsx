import { useState } from "react";
import SearchSuggestions from "./SearchSuggestions";
import { categories, priceFilters } from '../utils/constants';

const FiltersBar = ({ filters, setFilters, showCategory = true }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (  
  
  <div className="card flex flex-wrap gap-3 p-3">

  {/* SEARCH */}
  <div className="relative flex-1 min-w-[200px]">
    <input
      type="text"
      value={filters.q || ""}
      onChange={(e) => {
        setFilters((c) => ({ ...c, q: e.target.value, page: 1 }));
        console.log("FILTER SENT:", debouncedFilters);
        setShowSuggestions(true);
      }}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      placeholder="Search products..."
      className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm"
    />

    {showSuggestions && (
      <SearchSuggestions
        query={filters.q}
        onClose={() => setShowSuggestions(false)}
      />
    )}
  </div>

    {/* CATEGORY */}
    {showCategory && (
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters({
  ...filters,
  category: e.target.value,
  page: 1
})
        }
        className="flex-1 min-w-[150px] h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
    )}

    {/* PRICE */}
    <select
      value={filters.maxPrice}
      onChange={(e) =>
        setFilters((c) => ({ ...c, maxPrice: e.target.value, page: 1 }))
      }
      className="flex-1 min-w-[150px] h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
    >
      <option value="">Price Range</option>
      {priceFilters.map((price) => (
        <option key={price} value={price}>
          Under ₹{price}
        </option>
      ))}
    </select>

    {/* SORT */}
    <select
      value={filters.sort}
      onChange={(e) =>
        setFilters((c) => ({ ...c, sort: e.target.value, page: 1 }))
      }
      className="flex-1 min-w-[150px] h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
    >
      <option value="">Newest</option>
      <option value="price_asc">Price: Low → High</option>
      <option value="price_desc">Price: High → Low</option>
    </select>

  </div>  
  );
};

export default FiltersBar;