import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetUserDetails(): UseQueryResult<unknown, Error> {
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/users/me`, {
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
    queryKey: ['currentUser'],
    queryFn: () => getUserDetails(),
  });
}
