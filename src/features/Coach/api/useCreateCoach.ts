import { useMutation } from '@tanstack/react-query';

interface CoachData {
  clubId: string;
  name: string;
  email: string;
}

const createCoach = async (coachData: CoachData): Promise<CoachData> => {
  const token = localStorage.getItem('jwtToken');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(
    `${BASE_URL}/api/clubs/${coachData.clubId}/coaches`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(coachData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create coach');
  }

  return response.json();
};

export function useCreateCoach() {
  const { mutate, isPending } = useMutation<CoachData, Error, CoachData>({
    mutationFn: createCoach,
    onSuccess: () => {
      alert('Coach created successfully!');
    },
    onError: (error) => {
      alert(error.message || 'Failed to create coach.');
    },
  });

  return { mutate, isPending };
}
