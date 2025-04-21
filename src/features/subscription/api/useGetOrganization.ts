import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetOrganizations(): UseQueryResult<unknown, Error> {
  const getOrganizations = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/organizations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  return useQuery<unknown, Error>({
    queryKey: ['organization'],
    queryFn: () => getOrganizations(),
  });
}
