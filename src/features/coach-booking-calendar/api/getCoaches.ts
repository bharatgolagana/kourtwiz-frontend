import axios from 'axios';

export const fetchCoaches = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.get(`${BASE_URL}/api/clubs/${clubId}/coaches`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
