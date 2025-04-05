import { useMutation } from '@tanstack/react-query';

interface BookingData {
  userId: string;
  coachId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const bookCoach = async (bookingData: BookingData): Promise<Response> => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch('http://44.216.113.234:8080/api/book-coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to book a coach');
  }

  return response;
};

export function useBookCoach(handleCloseModal: () => void) {
  const { mutate, isPending } = useMutation<Response, Error, BookingData>({
    mutationFn: bookCoach,
    onSuccess: async (response) => {
      if (response.status === 200) {
        const message = await response.text(); 
        alert(message); 
        handleCloseModal();
      }
    },
  });

  return { bookCoach: mutate, bookingLoading: isPending };
}
