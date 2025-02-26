import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { fetchProducts } from "../api";

Modal.setAppElement("#root");

const ProductPicker = ({ setProducts, close }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [products, setFetchedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts(search, page);
      setFetchedProducts((prev) => [...prev, ...data]);
      setIsLoading(false);
    };

    loadProducts();
  }, [search, page]);

  const handleSelection = (product) => {
    setProducts((prev) => [...prev, product]);
    close();
  };

  return (
    <Modal
      isOpen
      onRequestClose={close}
      className="bg-white p-4 rounded shadow-lg max-w-lg mx-auto mt-20"
    >
      <h2 className="text-xl font-bold">Select a Product</h2>
      <input
        type="text"
        placeholder="Search products..."
        className="border p-2 w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="max-h-60 overflow-y-auto"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
              setPage((prev) => prev + 1);
            }
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 border-b"
              onClick={() => handleSelection(product)}
            >
              <p>{product.title}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={close} className="mt-4 text-red-500">
        Close
      </button>
    </Modal>
  );
};

export default ProductPicker;
