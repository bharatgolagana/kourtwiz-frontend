import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetClubBookings(clubId: string): UseQueryResult<unknown, Error> {
  const getClubBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/bookings/club/${clubId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courts');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return useQuery<unknown, Error>({
    queryKey: ['clubBookings', clubId],
    queryFn: getClubBookings,
    enabled: !!clubId,
  });
}