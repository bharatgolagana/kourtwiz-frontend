export async function payBooking(bookingId: string): Promise<unknown> {
  try {
    const token = localStorage.getItem('jwtToken');
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/bookings/booking/${bookingId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }
    return await response.text();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function cancelBooking(bookingId: string): Promise<unknown> {
  try {
    const token = localStorage.getItem('jwtToken');
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
    return await response.text();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
