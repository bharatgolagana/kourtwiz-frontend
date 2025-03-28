import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const validateOtp = async ({ recipient, otp }) => {
  const token = localStorage.getItem('jwtToken');
  if (!recipient || !otp) {
    throw new Error('Recipient and OTP are required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/otp/validate?recipient=${encodeURIComponent(
      recipient
    )}&otp=${encodeURIComponent(otp)}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useValidateOtp = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: validateOtp,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
