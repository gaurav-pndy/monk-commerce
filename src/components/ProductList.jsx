import React, { useState, useCallback, useRef } from "react";
import ProductItem from "./ProductItem";
import VariantItem from "./VariantItem";
import AddProductButton from "./AddProductButton";
import ProductPicker from "./ProductPicker";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: "empty", title: "", discountValue: "", discountType: "" },
  ]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});

  const openProductPicker = (index) => {
    setEditingProductIndex(index);
    setIsPickerOpen(true);
  };

  const removeProduct = (index) => {
    setExpandedProducts((prev) => {
      const newState = { ...prev };
      delete newState[index];

      Object.keys(newState).forEach((key) => {
        const numKey = parseInt(key, 10);
        if (numKey > index) {
          newState[numKey - 1] = newState[key];
          delete newState[key];
        }
      });

      return newState;
    });

    setProducts((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleVariants = (productIndex) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productIndex]: !prev[productIndex],
    }));
  };

  const removeVariant = (productIndex, variantIndex) => {
    setProducts((prev) => {
      const updatedProducts = [...prev];
      const product = { ...updatedProducts[productIndex] };

      if (
        product.variants &&
        Array.isArray(product.variants) &&
        product.variants.length > 1
      ) {
        product.variants = product.variants.filter(
          (_, idx) => idx !== variantIndex
        );
        updatedProducts[productIndex] = product;
        return updatedProducts;
      }

      return prev;
    });
  };

  const moveVariant = useCallback((productIndex, fromIndex, toIndex) => {
    setProducts((prev) => {
      try {
        const updatedProducts = [...prev];

        if (!updatedProducts[productIndex]) {
          return prev;
        }

        const product = { ...updatedProducts[productIndex] };

        if (!product.variants || !Array.isArray(product.variants)) {
          return prev;
        }

        if (
          fromIndex < 0 ||
          fromIndex >= product.variants.length ||
          toIndex < 0 ||
          toIndex >= product.variants.length
        ) {
          return prev;
        }

        const variants = [...product.variants];

        const [movedVariant] = variants.splice(fromIndex, 1);
        variants.splice(toIndex, 0, movedVariant);

        product.variants = variants;
        updatedProducts[productIndex] = product;

        return updatedProducts;
      } catch (error) {
        console.error("Error moving variant:", error);
        return prev;
      }
    });
  }, []);

  const moveProduct = useCallback((dragIndex, hoverIndex) => {
    setProducts((prev) => {
      try {
        if (
          dragIndex < 0 ||
          dragIndex >= prev.length ||
          hoverIndex < 0 ||
          hoverIndex >= prev.length
        ) {
          return prev;
        }

        const updatedProducts = [...prev];
        const [movedItem] = updatedProducts.splice(dragIndex, 1);
        updatedProducts.splice(hoverIndex, 0, movedItem);

        setExpandedProducts((prevExpanded) => {
          const newExpanded = {};

          Object.keys(prevExpanded).forEach((key) => {
            const numKey = parseInt(key, 10);
            if (numKey === dragIndex) {
              newExpanded[hoverIndex] = prevExpanded[numKey];
            } else if (numKey < dragIndex && numKey < hoverIndex) {
              newExpanded[numKey] = prevExpanded[numKey];
            } else if (numKey > dragIndex && numKey > hoverIndex) {
              newExpanded[numKey] = prevExpanded[numKey];
            } else if (dragIndex < numKey && numKey <= hoverIndex) {
              newExpanded[numKey - 1] = prevExpanded[numKey];
            } else if (dragIndex > numKey && numKey >= hoverIndex) {
              newExpanded[numKey + 1] = prevExpanded[numKey];
            }
          });

          return newExpanded;
        });

        return updatedProducts;
      } catch (error) {
        console.error("Error moving product:", error);
        return prev;
      }
    });
  }, []);

  const updateProductDiscount = (productIndex, field, value) => {
    setProducts((prev) => {
      try {
        if (productIndex < 0 || productIndex >= prev.length) {
          return prev;
        }

        const updatedProducts = [...prev];
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          [field]: value,
        };
        return updatedProducts;
      } catch (error) {
        console.error("Error updating product discount:", error);
        return prev;
      }
    });
  };

  const updateVariantDiscount = (productIndex, variantIndex, field, value) => {
    setProducts((prev) => {
      try {
        if (productIndex < 0 || productIndex >= prev.length) {
          return prev;
        }

        const updatedProducts = [...prev];
        const product = { ...updatedProducts[productIndex] };

        if (
          !product.variants ||
          !Array.isArray(product.variants) ||
          variantIndex < 0 ||
          variantIndex >= product.variants.length
        ) {
          return prev;
        }

        const updatedVariants = [...product.variants];
        updatedVariants[variantIndex] = {
          ...updatedVariants[variantIndex],
          [field]: value,
        };
        product.variants = updatedVariants;
        updatedProducts[productIndex] = product;

        return updatedProducts;
      } catch (error) {
        console.error("Error updating variant discount:", error);
        return prev;
      }
    });
  };

  const shouldShowToggle = (product) => {
    return (
      product &&
      product.variants &&
      Array.isArray(product.variants) &&
      product.variants.length > 1
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative lg:w-2/3 mt-10">
        <h2 className="text-xl font-semibold mb-10">Add Products</h2>
        <div className="rounded">
          <div className="flex pl-16 lg:pb-2 font-semibold">
            <span className="w-3/5">Product</span>
            <span className="w-2/5">Discount</span>
          </div>

          {products.map((product, productIndex) => (
            <div
              key={`product-${productIndex}-${product.id || "empty"}`}
              className="pb-6 border-b border-gray-300"
            >
              <div className="py-4">
                <ProductItem
                  product={product}
                  index={productIndex}
                  moveProduct={moveProduct}
                  openProductPicker={openProductPicker}
                  removeProduct={removeProduct}
                  updateProductDiscount={(field, value) =>
                    updateProductDiscount(productIndex, field, value)
                  }
                />

                {shouldShowToggle(product) && (
                  <button
                    onClick={() => toggleVariants(productIndex)}
                    className="cursor-pointer underline float-right text-[#006EFF]"
                  >
                    {expandedProducts[productIndex]
                      ? "Hide Variants"
                      : "Show Variants"}
                  </button>
                )}
              </div>

              {shouldShowToggle(product) && expandedProducts[productIndex] && (
                <div className="md:ml-16 mt-2 pl-4">
                  {product.variants.map((variant, variantIndex) => (
                    <VariantItem
                      key={`variant-${productIndex}-${variantIndex}-${
                        variant.id || "empty"
                      }`}
                      variant={variant || {}}
                      productIndex={productIndex}
                      variantIndex={variantIndex}
                      moveVariant={moveVariant}
                      removeVariant={() =>
                        removeVariant(productIndex, variantIndex)
                      }
                      canRemove={product.variants.length > 1}
                      productDiscount={{
                        value: product.discountValue || "",
                        type: product.discountType || "",
                      }}
                      updateVariantDiscount={(field, value) =>
                        updateVariantDiscount(
                          productIndex,
                          variantIndex,
                          field,
                          value
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute right-0">
          <AddProductButton
            onClick={() =>
              setProducts((prev) => [
                ...prev,
                { id: "empty", title: "", discountValue: "", discountType: "" },
              ])
            }
          />
        </div>

        {isPickerOpen && editingProductIndex !== null && (
          <ProductPicker
            setProducts={setProducts}
            close={() => setIsPickerOpen(false)}
            productIndex={editingProductIndex}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default ProductList;
