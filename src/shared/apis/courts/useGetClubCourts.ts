import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubCourt = async (clubId) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  if (!token) {
    throw new Error('No token found');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.get(
    `${BASE_URL}/courts/club/${clubId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useGetClubCourt = (clubId) => {
  return useQuery({
    queryKey: ['club-court', clubId],
    queryFn: () => fetchClubCourt(clubId),
    enabled: !!clubId, // Prevents execution if clubId is empty
  });
};
