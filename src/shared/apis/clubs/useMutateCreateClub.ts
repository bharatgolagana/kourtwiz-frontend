import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const createClub = async ({
  planId,
  clubData,
}: {
  planId: string;
  clubData: any;
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.post(
    `${BASE_URL}/clubs?planId=${planId}`,
    clubData,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateCreateClub = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: createClub,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.log('error: ', error);
      onErrorCallback?.(error);
    },
  });
};
