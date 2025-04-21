import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubPlans = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log("base URL", BASE_URL, import.meta.env)
    const response = await axios.get(`${BASE_URL}/club/plans`, {
      headers: {
        Accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching club plans:', error);
    throw error; // rethrow so react-query knows there was an error
  }
};

export const useGetClubPlans = () => {
  return useQuery({
    queryKey: ['club-plans'],
    queryFn: fetchClubPlans,
  });
};
