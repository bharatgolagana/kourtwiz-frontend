import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetPreviousBookings(userId: string): UseQueryResult<unknown, Error> {
  const getPreviousBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/bookings/user/${userId}`, {
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
    queryKey: ['previousBookings', userId],
    queryFn: getPreviousBookings,
    enabled: !!userId,
  });
}