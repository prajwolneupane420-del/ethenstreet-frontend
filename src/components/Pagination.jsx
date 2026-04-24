const Pagination = ({ page, pages, onChange }) =>
  pages > 1 ? (
    <div className="mt-8 flex flex-wrap gap-2">
      {Array.from({ length: pages }).map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onChange(index + 1)}
          className={`h-10 w-10 rounded-full text-sm font-semibold ${page === index + 1 ? 'bg-brand-navy text-white' : 'bg-white text-brand-navy'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  ) : null;

export default Pagination;
