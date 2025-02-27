import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaPen } from "react-icons/fa";
import { LuGripVertical } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

const ItemType = "PRODUCT";

const ProductItem = ({
  product,
  index,
  moveProduct,
  openProductPicker,
  removeProduct,
  updateProductDiscount,
}) => {
  const [discountValue, setDiscountValue] = useState(
    product.discountValue || "0"
  );
  const [discountType, setDiscountType] = useState(product.discountType || "");
  const [isEditing, setIsEditing] = useState(false);

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, id: product.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveProduct(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const applyDiscountToVariants = (value, type) => {
    if (updateProductDiscount) {
      updateProductDiscount("discountValue", value);
      updateProductDiscount("discountType", type);
    }
  };

  return (
    <div
      ref={ref}
      className={`flex mb-2 gap-2 lg:gap-4 text-gray-700 items-center transition-transform duration-200 text-sm md:text-base ${
        isOver ? "border-t-2 border-blue-500" : ""
      }`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? "10" : "1",
      }}
    >
      <span className="cursor-grab flex gap-2 items-center w-1/12 text-gray-500">
        <LuGripVertical className="text-2xl" /> {index + 1}.
      </span>

      <div className="w-[55%] md:w-3/5 flex bg-white px-4 py-2 items-center justify-between rounded shadow-black/10 shadow-md ">
        <h3 className="w-full">{product.title || "Select Product"}</h3>
        <FaPen
          className="opacity-60 text-xl cursor-pointer ml-2"
          onClick={() => openProductPicker(index)}
        />
      </div>

      <div className="w-[45%] md:w-2/5">
        <div className="">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="md:px-6 w-full py-2 rounded bg-[#008060] text-white"
            >
              Add Discount
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => {
                  setDiscountValue(e.target.value);
                  applyDiscountToVariants(e.target.value, discountType);
                }}
                className="px-3 p-2 rounded shadow-black/10 shadow-md w-2/5 bg-white"
              />
              <select
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  applyDiscountToVariants(discountValue, e.target.value);
                }}
                className="w-3/5 px-3 p-2 rounded shadow-black/10 shadow-md bg-white"
              >
                <option className="text-[0.5rem] md:text-base" value="flat">
                  Flat off
                </option>
                <option
                  className="text-[0.5rem] md:text-base"
                  value="percentage"
                >
                  % off
                </option>
              </select>
            </div>
          )}
        </div>
      </div>

      {removeProduct && (
        <button onClick={() => removeProduct(index)} className="">
          <RxCross1 className="cursor-pointer text-lg text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default ProductItem;
