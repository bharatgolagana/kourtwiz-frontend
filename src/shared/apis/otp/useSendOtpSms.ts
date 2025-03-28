import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const sendOtpSms = async ({ phone }) => {
  const token = localStorage.getItem('jwtToken');
  if (!phone) {
    throw new Error('Phone number is required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/otp/send-sms?phone=${phone}`,
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

export const useSendOtpSms = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: sendOtpSms,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
