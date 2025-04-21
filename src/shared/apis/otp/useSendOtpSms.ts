import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const sendOtpSms = async ({ phone }: { phone: string }) => {
  if (!phone) {
    throw new Error('Phone number is required');
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.post(
    `${BASE_URL}/otp/send-sms?phone=${phone}`,
    {},
    {
      headers: {
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
