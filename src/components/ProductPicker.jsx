import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { fetchProducts } from "../api";
import { CiSearch } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { FiLoader } from "react-icons/fi";

Modal.setAppElement("#root");

const ProductPicker = ({ setProducts, close, productIndex }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [products, setFetchedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts(search, page);
        if (page === 1) {
          setFetchedProducts(data);
        } else {
          setFetchedProducts((prev) => [...prev, ...data]);
        }
        setHasMore(data?.length > 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [search, page]);

  useEffect(() => {
    setPage(1);
    setFetchedProducts([]);
    setHasMore(true);
  }, [search]);

  const isProductSelected = (product) => {
    return product.variants.some((variant) =>
      selectedVariants.some((selected) => selected.id === variant.id)
    );
  };

  const isVariantSelected = (variantId) =>
    selectedVariants.some((variant) => variant.id === variantId);

  const toggleProductSelection = (product) => {
    if (isProductSelected(product)) {
      setSelectedVariants(
        selectedVariants.filter(
          (selected) =>
            !product.variants.some((variant) => variant.id === selected.id)
        )
      );
    } else {
      setSelectedVariants([
        ...selectedVariants,
        ...product.variants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          price: variant.price,
          productId: product.id,
          productTitle: product.title,
          productImage: product.image.src,
        })),
      ]);
    }
  };

  const toggleVariantSelection = (product, variant) => {
    setSelectedVariants((prev) =>
      isVariantSelected(variant.id)
        ? prev.filter((selected) => selected.id !== variant.id)
        : [
            ...prev,
            {
              id: variant.id,
              title: variant.title,
              price: variant.price,
              productId: product.id,
              productTitle: product.title,
              productImage: product.image?.src || "images/defaultImg.svg",
            },
          ]
    );
  };

  const handleAddProducts = () => {
    if (selectedVariants.length === 0) return;

    const groupedByProduct = selectedVariants.reduce((acc, variant) => {
      if (!acc[variant.productId]) {
        acc[variant.productId] = {
          id: variant.productId,
          title: variant.productTitle,
          image: { src: variant.productImage },
          variants: [],
        };
      }
      acc[variant.productId].variants.push({
        id: variant.id,
        title: variant.title,
        price: variant.price,
      });
      return acc;
    }, {});

    const productsToAdd = Object.values(groupedByProduct);

    setProducts((prev) => {
      let updatedProducts = [...prev];
      updatedProducts[productIndex] = productsToAdd[0];
      if (productsToAdd.length > 1) {
        updatedProducts.splice(productIndex + 1, 0, ...productsToAdd.slice(1));
      }
      return updatedProducts;
    });

    close();
  };

  return (
    <Modal
      isOpen
      onRequestClose={close}
      className="bg-white rounded shadow-lg max-w-2xl mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black/20"
    >
      <div className="px-4 md:px-6 py-2 border-b border-gray-300 flex justify-between">
        <h2 className="text-xl font-semibold">Select Products</h2>
        <button onClick={close}>
          <RxCross1 className="text-2xl cursor-pointer" />
        </button>
      </div>
      <div className="w-full border-b border-gray-300 px-7">
        <div className="flex items-center w-full border border-gray-300 my-2 px-3">
          <CiSearch className="text-xl text-gray-500" />
          <input
            type="text"
            placeholder="Search product"
            className="px-2 py-1 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div
        className="h-[26rem] scroll-thin overflow-y-auto"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            !isLoading &&
            hasMore
          ) {
            setPage((prev) => prev + 1);
          }
        }}
      >
        {products?.length === 0 && isLoading ? (
          <div className="h-full flex items-center justify-center">
            <FiLoader className="animate-spin text-4xl text-gray-600" />
          </div>
        ) : (
          <>
            {products?.map((product) => (
              <div key={product.id} className="mb-2">
                <div className="flex px-4 md:px-7 py-3 gap-4 border-b border-gray-300 items-center">
                  <input
                    type="checkbox"
                    checked={isProductSelected(product)}
                    onChange={() => toggleProductSelection(product)}
                    className="w-4 md:w-6 h-4 md:h-6 cursor-pointer"
                  />
                  <img
                    src={product.image?.src || "images/defaultImg.svg"}
                    alt=""
                    className="w-10 h-10 border border-gray-300"
                  />
                  <span className="md:text-lg">{product.title}</span>
                </div>
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex border-b border-gray-300 justify-between mb-2 px-8 pl-12 md:pl-[4.3rem] py-3 items-center"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isVariantSelected(variant.id)}
                        onChange={() =>
                          toggleVariantSelection(product, variant)
                        }
                        className="w-4 md:w-6 h-4 md:h-6 cursor-pointer"
                      />
                      <span className="md:text-lg">{variant.title}</span>
                    </div>
                    <span className="md:text-lg">${variant.price}</span>
                  </div>
                ))}
              </div>
            ))}

            {isLoading && products.length > 0 && (
              <div className="flex justify-center py-4">
                <FiLoader className="animate-spin text-4xl text-gray-600" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t font-semibold border-gray-300 flex justify-between items-center py-3 px-4 md:px-7">
        <span className="text-black opacity-90">
          {new Set(selectedVariants.map((variant) => variant.productId)).size}{" "}
          product(s) selected
        </span>

        <div className="flex gap-4">
          <button
            onClick={close}
            className="text-[#008060] border px-4 md:px-8 py-1 cursor-pointer rounded border-[#008060]"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProducts}
            className="bg-[#008060] text-white px-4 md:px-6 py-1 cursor-pointer rounded"
            disabled={selectedVariants.length === 0}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductPicker;
