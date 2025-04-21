import axios from 'axios';

export const fetchCourts = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken'); 
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.post(
      `http:${BASE_URL}/courts/club/${clubId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.map((court: any) => ({ id: court.id, title: court.name }));
};
