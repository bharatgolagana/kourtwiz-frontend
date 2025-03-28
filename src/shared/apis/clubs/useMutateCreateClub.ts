import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const createClub = async ({
  planId,
  clubData,
}: {
  planId: string;
  clubData: any;
}) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/clubs?planId=${planId}`,
    clubData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateCreateClub = (
  onSuccess?: (data: any) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: createClub,
    onSuccess,
    onError,
  });
};
