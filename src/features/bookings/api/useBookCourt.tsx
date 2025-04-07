import { useMutation } from '@tanstack/react-query';

interface BookingData {
  userId: string;
  clubId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string;
  status: string;
}

const bookCourt = async (bookingData: BookingData): Promise<Response> => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch('http://44.216.113.234:8080/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to book the court');
  }

  return response;
};

export function useBookCourt(handleCloseModal: () => void) {
  const { mutate, isPending } = useMutation<Response, Error, BookingData>({
    mutationFn: bookCourt,
    onSuccess: async (response) => {
      if (response.status === 200) {
        const message = await response.text(); 
        alert(message); 
        handleCloseModal();
        // window.location.reload();
      }
    },
    onError: async (error: any) => {
      if (error instanceof Response) {
        const errorMessage = await error.text();
        alert(`Booking failed: ${errorMessage}`);
      } else {
        alert(`Booking failed: ${error.message || 'An unknown error occurred'}`);
      }
    },
  });

  return { bookCourt: mutate, bookingLoading: isPending };
}
