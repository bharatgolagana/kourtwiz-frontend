import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetWaitlist(userId: string): UseQueryResult<unknown, Error> {
  const getWaitlist = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/play-type/waitlist?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch waitlist: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      throw err;
    }
  };

  return useQuery<unknown, Error>({
    queryKey: ['waitlist', userId],
    queryFn: getWaitlist,
    enabled: !!userId,
  });
}
