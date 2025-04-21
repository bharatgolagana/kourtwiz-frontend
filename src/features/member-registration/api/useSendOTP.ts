import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const sendEmailOTP = async (email: string) => {
  return axios.post(`${BASE_URL}/temp-otp/send-email?email=${email}`);
};

const sendPhoneOTP = async (phoneNumber: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return axios.post(`${BASE_URL}/otp/send-sms?phone=${phoneNumber}`);
};

export const useSendOTP = () => {
  const emailOTP = useMutation({ mutationFn: sendEmailOTP });
  const phoneOTP = useMutation({ mutationFn: sendPhoneOTP });

  return { emailOTP, phoneOTP };
};
