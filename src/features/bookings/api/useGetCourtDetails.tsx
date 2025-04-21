import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetCourtDetails(courtId: string): UseQueryResult<unknown, Error> {
  const getBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/bookings/court/${courtId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return useQuery<unknown, Error>({
    queryKey: ['bookings', courtId],
    queryFn: getBookings,
    enabled: !!courtId,
  });
}
