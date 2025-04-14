import { useContext } from "react";


import { useGetOpenplayBookings } from "../../features/bookings/api/useGetOpenplayBookings";
import AuthContext from "../../context/AuthContext";

const OpenPlayBookingsPage = () => {
  const { user } = useContext(AuthContext)!;

  if (!user) {
    return <p>Loading...</p>;
  }

  const userId = user?.userId;
  

  const { data: clubBookingData, isLoading, error: isError } = useGetOpenplayBookings(userId);

  return (
    <div className="ClubSchedulePage">
      <h2>Your Play Bookings</h2>
      <div className="table-container">
        {isLoading ? (
          <p>Loading bookings...</p>
        ) : isError ? (
          <p>Error loading bookings: {isError.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Play Type</th>
                <th>Court</th>
                <th>Duration</th>
                <th>Skill Level</th>
                <th>Max Players</th>
                <th>Slots filled</th>
              </tr>
            </thead>
            <tbody>
              {clubBookingData?.length > 0 ? (
                clubBookingData.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td>{booking.playTypeName}</td>
                      <td>{booking.courtName}</td>
                    
                      <td>
                        {booking.durationMinutes}
                      </td>
                      <td>{booking.skillLevel}</td>
                      <td>{booking.maxPlayers}</td>
                      <td>{booking.registeredPlayers?.length}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OpenPlayBookingsPage;
