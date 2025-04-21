import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const validateOTP = async ({ recipient, otp }: { recipient: string; otp: string }) => {
  const response = await axios.post(`${BASE_URL}/temp-otp/validate?recipient=${recipient}&otp=${otp}`);
  return response.data.valid;
};

export const useValidateOTP = () => {
  return useMutation({ mutationFn: validateOTP });
};
