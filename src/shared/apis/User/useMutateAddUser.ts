import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://44.216.113.234:8080/users';

interface UserData {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  profilePictureUrl: string;
  dateOfBirth: string;
  currentActiveClubId: string;
  skillLevel: string;
  preferredTime: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface useMutateAddUserProps {
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useMutateAddUser = ({
  onSuccessCallback,
  onErrorCallback,
}: useMutateAddUserProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserData) => {
      const response = await axios.post(API_BASE_URL, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usersByClubId'] }); // Invalidate relevant query keys
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      onErrorCallback?.(error);
    },
  });
};
