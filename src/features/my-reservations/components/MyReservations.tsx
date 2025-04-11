import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './styles.css'

import AuthContext from "../../../context/AuthContext";
import { useGetCourts } from "../../bookings/api/useGetCourts";
import { useGetPreviousBookings } from "../../bookings/api/useGetUserPreviousBookings";
import { payBooking, cancelBooking } from "../api/actions";

const MyReservations = () => {
  const { user } = useContext(AuthContext)!;
  const queryClient = useQueryClient();
  const userId = user.userId;
  const clubId = user.userClubRole?.[0]?.clubId ?? "";

  const { data: clubBookingData, isLoading, error: isError } = useGetPreviousBookings(userId);
  const { data: courtsData } = useGetCourts(clubId);

  const payMutation = useMutation({
    mutationFn: (bookingId: string) => payBooking(bookingId),
    onSuccess: () => {
      toast.success("Payment successful ✅");
      queryClient.invalidateQueries({ queryKey: ["previousBookings", userId] });
    },
    onError: () => toast.error("Payment failed ❌"),
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking cancelled 🗑️");
      queryClient.invalidateQueries({ queryKey: ["previousBookings", userId] });
    },
    onError: () => toast.error("Failed to cancel booking ❌"),
  });

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ClubSchedulePage">
      <h2>Your Club Bookings</h2>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="table-container">
        {isLoading ? (
          <p>Loading bookings...</p>
        ) : isError ? (
          <p>Error loading bookings: {isError.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Court</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubBookingData?.length > 0 ? (
                clubBookingData.map((booking) => {
                  const courtName =
                    courtsData?.find((court) => court.id === booking.courtId)?.name ||
                    "Unknown Court";

                  return (
                    <tr key={booking.id}>
                      <td>{courtName}</td>
                      <td>{`${booking.date[1]}-${booking.date[2]}-${booking.date[0]}`}</td>
                      <td>
                        {`${booking.startTime[0]}:${String(booking.startTime[1]).padStart(2, "0")}`}
                      </td>
                      <td>
                        {`${booking.endTime[0]}:${String(booking.endTime[1]).padStart(2, "0")}`}
                      </td>
                      <td>{booking.status}</td>
                      <td>
                        <div>
                        <button
                            className={`button paid-button`}
                            onClick={() => payMutation.mutate(booking.id)}
                            disabled={payMutation.isLoading || cancelMutation.isLoading || booking.paid}
                          >
                            {booking.paid ? "Paid" : payMutation.isLoading ? "Paying..." : "Pay"}
                          </button>
                          <button
                            className={`button withdraw-button`}
                            onClick={() => {
                              const confirmed = window.confirm("Are you sure you want to cancel?");
                              if (confirmed) cancelMutation.mutate(booking.id);
                            }}
                          >
                            {cancelMutation.isLoading ? "Cancelling..." : "Withdraw"}
                          </button>
                        </div>
                      </td>
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

export default MyReservations;
