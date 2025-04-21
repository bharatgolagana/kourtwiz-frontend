const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchClubs = async () => {
  try {
    console.log("BASE URL", BASE_URL)
    const response = await fetch(`${BASE_URL}/clubs`);
    if (!response.ok) {
      throw new Error("Failed to fetch club details");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

