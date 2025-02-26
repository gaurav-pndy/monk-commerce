const API_URL = "https://stageapi.monkcommerce.app/task/products/search";
const API_KEY = "72njgfa948d9aS7gs5"; // Replace with actual key

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
