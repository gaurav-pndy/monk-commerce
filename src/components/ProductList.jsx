import React, { useState } from "react";
import ProductItem from "./ProductItem";
import AddProductButton from "./AddProductButton";
import ProductPicker from "./ProductPicker";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Function to add a new empty product (if none exist)
  const addEmptyProduct = () => {
    if (products.length === 0) {
      setProducts([
        { id: "empty", title: "", discountValue: "", discountType: "" },
      ]);
    }
  };

  // Ensure at least one empty item is always visible
  React.useEffect(() => {
    addEmptyProduct();
  }, []);

  return (
    <div className="relative ">
      <h2 className="text-xl font-semibold mb-4">Add Products</h2>
      <div className=" rounded">
        {/* Column Headings */}
        <div className="flex pb-2 mb-2 font-semibold">
          <span className="w-1/12">#</span>
          <span className="w-2/3">Product</span>
          <span className="w-1/3">Discount</span>
        </div>

        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            index={index}
            setProducts={setProducts}
          />
        ))}
      </div>
      <div className=" absolute right-0">
        <AddProductButton onClick={() => setIsPickerOpen(true)} />
      </div>
      {isPickerOpen && (
        <ProductPicker
          setProducts={setProducts}
          close={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductList;
