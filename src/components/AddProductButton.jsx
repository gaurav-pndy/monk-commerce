import React from "react";

const AddProductButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer text-sm md:text-base mt-4 border-3 border-[#008060] text-[#008060] font-semibold px-12 py-3 rounded"
    >
      Add Product
    </button>
  );
};

export default AddProductButton;
