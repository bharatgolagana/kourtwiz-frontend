import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const updateUserById = async ({ userId, userData }) => {
  const token = localStorage.getItem('jwtToken');
  if (!userId) throw new Error('User ID is required');
  if (!token) throw new Error('No token found');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.put(
    `${BASE_URL}/users/${userId}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const useUpdateUserById = () => {
  return useMutation({
    mutationFn: updateUserById,
    onSuccess: () => {
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};
