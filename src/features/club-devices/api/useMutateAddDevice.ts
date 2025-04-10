import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addDevice = async (deviceData) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    'http://44.216.113.234:8080/api/devices',
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
