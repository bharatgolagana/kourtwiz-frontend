import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const changeSelectedClub = async ({ clubId }: { clubId: string }) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.put(
    `${BASE_URL}/users/change-active-club/${clubId}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateChangeActiveclub = ({
  onSuccessCallback,
  onErrorCallback,
}) => {
  return useMutation({
    mutationFn: changeSelectedClub,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.log('error: ', error);
      onErrorCallback?.(error);
    },
  });
};
