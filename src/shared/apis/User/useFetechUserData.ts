import { useMutation } from '@tanstack/react-query';

const fetchUserData = async (token: string): Promise<any> => {
  console.log('fetching /me');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
};

export const useMutateFetchUserData = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      return await fetchUserData(token);
    },
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });

  return mutation;
};
