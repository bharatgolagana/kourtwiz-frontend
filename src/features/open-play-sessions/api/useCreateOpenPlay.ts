import { useMutation } from '@tanstack/react-query';

interface OpenPlaySessionData {
  clubId: string;
  courtId: string;
  startTime: string;
  durationMinutes: number;
  skillLevel: string;
  maxPlayers: number;
  playTypeName: string;
  priceForPlay: number;
  eventRepeatType?: string;       
  repeatInterval?: number;        
  repeatEndDate?: string;         
}

const createOpenPlaySession = async (sessionData: OpenPlaySessionData): Promise<OpenPlaySessionData> => {
  const token = localStorage.getItem('jwtToken');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${BASE_URL}/api/play-type/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create open play session');
  }

  return response.json();
};

export function useCreateOpenPlay() {
  const { mutate, isPending } = useMutation<OpenPlaySessionData, Error, OpenPlaySessionData>({
    mutationFn: createOpenPlaySession,
    onSuccess: (data) => {
      alert("Session created successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to create open play session.");
    },
  });

  return { mutate, isPending };
}
