import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const sendOtpEmail = async ({ email }) => {
  const token = localStorage.getItem('jwtToken');
  if (!email) {
    throw new Error('Email is required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/otp/send-email?email=${encodeURIComponent(
      email
    )}`,
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

export const useSendOtpEmail = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: sendOtpEmail,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
