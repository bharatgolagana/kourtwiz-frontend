export async function payBooking(bookingId: string): Promise<unknown> {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`http://44.216.113.234:8080/api/bookings/booking/${bookingId}/pay`, {
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
    const response = await fetch(`http://44.216.113.234:8080/api/bookings/${bookingId}`, {
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
