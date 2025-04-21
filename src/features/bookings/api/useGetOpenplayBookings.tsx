import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetOpenplayBookings(userId: string): UseQueryResult<unknown, Error> {
  const getOpenplayBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/play-type/bookings/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch previous bookings');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return useQuery<unknown, Error>({
    queryKey: ['openplayBookings', userId],
    queryFn: getOpenplayBookings,
    enabled: !!userId,
  });
}