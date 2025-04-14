import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetOpenplayBookings(userId: string): UseQueryResult<unknown, Error> {
  const getOpenplayBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://44.216.113.234:8080/api/play-type/bookings/${userId}`, {
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