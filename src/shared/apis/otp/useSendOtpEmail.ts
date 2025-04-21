import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const sendOtpEmail = async ({ email }) => {
  console.log('email otp : ', email);
  if (!email) {
    throw new Error('Email is required');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.post(
    `${BASE_URL}/temp-otp/send-email?email=${encodeURIComponent(
      email
    )}`,
    {},
    {
      headers: {
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
      console.log('error : ', error);
      onErrorCallback?.(error);
    },
  });
};
