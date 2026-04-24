import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;