import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addDevice = async (deviceData) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.post(
    `${BASE_URL}/api/devices`,
    deviceData,
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

export const useMutateAddDevice = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDevice,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
      queryClient.invalidateQueries(['club-devices']);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
