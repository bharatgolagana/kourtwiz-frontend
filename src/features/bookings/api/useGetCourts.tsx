import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetCourts(clubId: string): UseQueryResult<unknown, Error> {
  const getCourts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/courts/club/${clubId}`, {
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
    queryKey: ['courts', clubId],
    queryFn: getCourts,
    enabled: !!clubId,
  });
}
