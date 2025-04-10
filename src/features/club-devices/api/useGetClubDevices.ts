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

  const response = await axios.get(
    `http://44.216.113.234:8080/api/devices/club/${clubId}`,
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
