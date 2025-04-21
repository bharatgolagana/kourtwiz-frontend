import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubDevices = async (clubId: string) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  if (!token) {
    throw new Error('No token found');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const response = await axios.get(
    `${BASE_URL}/api/devices/club/${clubId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  return response.data;
};

export const useGetClubDevices = (clubId: string) => {
  return useQuery({
    queryKey: ['club-devices', clubId],
    queryFn: () => fetchClubDevices(clubId),
    enabled: !!clubId, 
  });
};
