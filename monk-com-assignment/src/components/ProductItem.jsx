import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "PRODUCT";

const ProductItem = ({ product, index, setProducts }) => {
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("");

  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        setProducts((prev) => {
          const updatedProducts = [...prev];
          const [movedItem] = updatedProducts.splice(draggedItem.index, 1);
          updatedProducts.splice(index, 0, movedItem);
          return updatedProducts;
        });
        draggedItem.index = index;
      }
    },
  });

  const updateDiscount = (value, type) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, discountValue: value, discountType: type }
          : p
      )
    );
  };

  const handleAddDiscount = () => {
    setIsEditingDiscount(true);
  };

  const handleRemoveDiscount = () => {
    setIsEditingDiscount(false);
    setDiscountValue("");
    setDiscountType("");
    updateDiscount("", "");
  };

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`flex   mb-2 gap-3 items-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Drag Handle & Numbering */}
      <span ref={ref} className="cursor-grab w-1/12 text-gray-500 text-lg">
        ≡ {index + 1}
      </span>

      {/* Product Column */}
      <div className="w-2/3">
        <h3 className=" p-2 rounded shadow-sm ">{product.title}</h3>
        {product.variants && product.variants.length > 1 && (
          <button className="text-blue-500 text-sm underline">
            Show Variants
          </button>
        )}
      </div>

      {/* Discount Column */}
      <div className="w-1/3 flex items-center">
        {!isEditingDiscount ? (
          <button
            onClick={handleAddDiscount}
            className="bg-[#008060] text-white px-6 py-2 rounded text-sm w-full"
          >
            Add Discount
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={discountValue}
              onChange={(e) => {
                setDiscountValue(e.target.value);
                updateDiscount(e.target.value, discountType);
              }}
              className="border p-1 rounded w-16"
              placeholder="Value"
            />
            <select
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                updateDiscount(discountValue, e.target.value);
              }}
              className="border p-1 rounded"
            >
              <option value="">Select</option>
              <option value="flat">Flat</option>
              <option value="percentage">%</option>
            </select>
            {/* <button
              onClick={handleRemoveDiscount}
              className="text-red-500 text-lg"
            >
              ❌
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
