import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateDeleteDevice = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const deleteDevice = async (deviceId: string | number) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.delete(
      `http://44.216.113.234:8080/api/devices/${deviceId}`,
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

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
      queryClient.invalidateQueries(['club-devices']);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
