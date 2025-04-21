import axios from 'axios';

export const fetchCoachBookings = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.get(`${BASE_URL}/api/clubs/${clubId}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const  coachBooking  = response.data;


  const formatDateTime = (dateArray: number[], timeArray?: number[]) => {
    const [year, month, day] = dateArray; 
    const [year2, month2, day2, hour, minute] = timeArray ?? [0, 0]; 
    return new Date(year, month - 1, day, hour, minute);
  };


  const courtEvents = coachBooking.map((booking: any) => ({
    id: booking.id,
    title: 'Reserved',
    start: formatDateTime(booking.date, booking.startTime),
    end: formatDateTime(booking.date, booking.endTime),
    resourceId: booking.coachId,
  }));

  return [...courtEvents];
};
