import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchPendingUsers = async (organizationId: string) => {
  const token = localStorage.getItem('jwtToken');
  if (!organizationId) return [];
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.get(
      `${BASE_URL}/temp-users/getAllTempUsersByOrg/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw error; // rethrow so react-query knows there was an error
  }
};

export const useGetPendingUsers = (organizationId: string) => {
  return useQuery({
    queryKey: ['pending-users', organizationId],
    queryFn: () => fetchPendingUsers(organizationId),
  });
};
