import axios from 'axios';

export const fetchPreviousCoachBookings = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.get(`${BASE_URL}/api/clubs/${clubId}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const coachBooking  = response.data;
//   console.log(coachBooking)

  const formatTime = ( timeArray?: number[]) => {
    const [year, month, day, hour, minute] = timeArray ?? [0, 0]; 
    return new Date(year, month - 1, day, hour, minute);
  };
  const formatDate = (dateArray:number[])=>{
    const [year, month, day] = dateArray; 
    return `${day}/${month}/${year}`
  }

  return coachBooking.map((booking: any) => ({
    id: booking.id,
    coachId: booking.coachId,
    date: formatDate(booking.date),
    start: formatTime( booking.startTime),
    end: formatTime( booking.endTime),
  }));
};
