import { useState } from 'react';
import { motion } from 'framer-motion';
import FiltersBar from './FiltersBar';

const MobileFilters = ({ filters, setFilters, onClose }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/40 z-50 flex items-end"
>

      {/* Bottom Sheet */}
      <motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", stiffness: 120 }}
  className="bg-white w-full rounded-t-3xl p-5 max-h-[80%] overflow-y-auto"
>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose} className="text-xl">✖</button>
        </div>

        {/* Filters */}
        <FiltersBar
          filters={tempFilters}
          setFilters={setTempFilters}
          showSearch={false}
        />

        {/* Apply Button */}
        <button
          onClick={() => {
            setFilters(tempFilters); // 🔥 APPLY REAL FILTERS
            onClose();
          }}
          className="btn-primary w-full mt-6"
        >
          Apply Filters
        </button>

      </motion.div>
    </motion.div>
  );
};

export default MobileFilters;