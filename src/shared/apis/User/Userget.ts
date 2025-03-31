import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchUserClubRoles = async (clubId) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(
    `http://44.216.113.234:8080/user-club-roles/club/${clubId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useGetUserClubRoles = (clubId) => {
  return useQuery({
    queryKey: ['user-club-roles', clubId],
    queryFn: () => fetchUserClubRoles(clubId),
    enabled: !!clubId, // Prevents execution if clubId is empty
  });
};
