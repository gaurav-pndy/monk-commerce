const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchProducts = async (search = "", page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}?search=${search}&page=${page}&limit=10`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch products");

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
