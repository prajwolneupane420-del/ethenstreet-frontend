const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[4/5] rounded-2xl"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;