import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetRoles(): UseQueryResult<unknown, Error> {
  const getRoles = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/roles`, {
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
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  });
}
