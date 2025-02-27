import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { LuGripVertical } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

const VariantType = "VARIANT";

const VariantItem = ({
  variant = {},
  productIndex,
  variantIndex,
  moveVariant,
  removeVariant,
  canRemove,
  productDiscount,
  updateVariantDiscount,
}) => {
  const isCustomDiscount = variant.discountValue !== undefined;
  const [discountValue, setDiscountValue] = useState(
    isCustomDiscount ? variant.discountValue : productDiscount?.value || "0"
  );
  const [discountType, setDiscountType] = useState(
    isCustomDiscount ? variant.discountType : productDiscount?.type || ""
  );

  const ref = useRef(null);

  useEffect(() => {
    if (!isCustomDiscount && productDiscount) {
      setDiscountValue(productDiscount.value || "");
      setDiscountType(productDiscount.type || "");
    }
  }, [productDiscount, isCustomDiscount]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: VariantType,
    item: {
      type: VariantType,
      id: variant.id || `temp-${productIndex}-${variantIndex}`,
      index: variantIndex,
      productIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: VariantType,
      hover: (item, monitor) => {
        if (!ref.current) {
          return;
        }

        if (item.productIndex !== productIndex) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = variantIndex;

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

        moveVariant(productIndex, dragIndex, hoverIndex);

        item.index = hoverIndex;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [productIndex, variantIndex, moveVariant]
  );

  drag(drop(ref));

  const variantTitle = variant.title || "Untitled Variant";
  const variantPrice = variant.price || "0.00";

  return (
    <div
      ref={ref}
      className={`flex items-center text-gray-700 justify-between gap-3 mb-4 transition-transform duration-200 ${
        isOver ? "border-t-2 border-blue-500" : ""
      }`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? "10" : "1",
      }}
    >
      <div className="text-gray-500 flex items-center cursor-grab">
        <LuGripVertical className="text-xl" />
      </div>

      <div className="w-[55%] flex items-center px-4 py-2 bg-white rounded-3xl shadow-black/10 shadow-md text-sm justify-between">
        <span>{variantTitle}</span>
        <span>${variantPrice}</span>
      </div>

      <div className="w-[45%] flex items-center justify-between">
        <div className="flex items-center text-sm gap-3">
          <input
            type="number"
            value={discountValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setDiscountValue(newValue);
              updateVariantDiscount("discountValue", newValue);
            }}
            className="p-2 w-2/5 bg-white rounded-3xl shadow-black/10 shadow-md"
          />
          <select
            value={discountType}
            onChange={(e) => {
              const newType = e.target.value;
              setDiscountType(newType);
              updateVariantDiscount("discountType", newType);
            }}
            className="bg-white  rounded-3xl shadow-black/10 shadow-md p-2 w-3/5"
          >
            <option className="text-[0.5rem] md:text-base" value="flat">
              Flat off
            </option>
            <option className="text-[0.5rem] md:text-base" value="percentage">
              % off
            </option>
          </select>
        </div>
      </div>

      {canRemove && (
        <button onClick={removeVariant} className="">
          <RxCross1 className="cursor-pointer text-lg text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default VariantItem;
