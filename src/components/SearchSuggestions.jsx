import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

const SearchSuggestions = ({ query, onClose }) => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchProducts({ q: query, limit: 5 })
        .then((res) => setResults(res.items || []))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!query || results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 z-50">
      {results.map((item) => (
        <div
          key={item._id}
          onClick={() => {
            navigate(`/product/${item.slug}`);
            onClose();
          }}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;