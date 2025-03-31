import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";
import { useGetPreviousBookings } from "../../features/bookings/api/useGetUserPreviousBookings";
import { useBookCourt } from "../../features/bookings/api/useBookCourt";
import Modal from "../../features/bookings/components/Modal";
import "./BookingsPage.css"

const BookingsPage = () => {
    const { user } = useContext(AuthContext)!;

    if (!user) {
        return <p>Loading...</p>;
    }

    const userId = user?.userId ?? "";
    const clubId = user?.userClubRole?.[0]?.clubId ?? "";


    const { data: courtsData, isLoading: courtsLoading, error: courtsError } = useGetCourts(clubId);
    const { data: previousBookings, isLoading: bookingsLoading, error: bookingsError, refetch } = useGetPreviousBookings(userId);

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("11:00");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (court) => {
        setSelectedCourt(court);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourt(null);
    };

    const { bookCourt, bookingLoading } = useBookCourt(() => {
        handleCloseModal()
        refetch();
    });
    const handleConfirmBooking = () => {
        if (!selectedCourt) return;

        const bookingData = {
            userId,
            clubId,
            courtId: selectedCourt.id,
            date: new Date().toISOString().split("T")[0],
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            participants: [userId],
        };

        bookCourt(bookingData);
    };

    return (
        <div className="BookingsPage">
            <h2>View Courts</h2>
            <div className="table-container">
                {courtsLoading ? (
                    <p>Loading courts...</p>
                ) : courtsError ? (
                    <p>Error loading courts: {courtsError.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Surface</th>
                                <th>Price Per Hour</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                                <th>Indoor</th>
                                <th>Available</th>
                                <th>Blocked Dates</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courtsData?.map((court) => (
                                <tr key={court.id}>
                                    <td>{court.name}</td>
                                    <td>{court.location}</td>
                                    <td>{court.type}</td>
                                    <td>{court.capacity}</td>
                                    <td>{court.surface}</td>
                                    <td>${court.pricePerHour}</td>
                                    <td>{court.openingTime}</td>
                                    <td>{court.closingTime}</td>
                                    <td>{court.indoor ? "Yes" : "No"}</td>
                                    <td>{court.available ? "Yes" : "No"}</td>
                                    <td>{court.blockedDates.join(", ")}</td>
                                    <td>
                                        <button
                                            onClick={() => handleOpenModal(court)}
                                            disabled={!court.available || bookingLoading}
                                        >
                                            {bookingLoading ? "Booking..." : "Book"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <h2>Previous Bookings</h2>
            <div className="table-container">
                {bookingsLoading ? (
                    <p>Loading previous bookings...</p>
                ) : bookingsError ? (
                    <p>Error loading previous bookings: {bookingsError.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                            
                                <th>Court </th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousBookings?.length > 0 ? (
                                previousBookings.map((booking) => {
                                    const courtName =
                                        courtsData?.find((court) => court.id === booking.courtId)?.name || "Unknown Court";

                                    return (
                                        <tr key={booking.id}>
                                            <td>{courtName}</td> 
                                            <td>
                                                {`${booking.date[0]}-${String(booking.date[1]).padStart(2, "0")}-${String(
                                                    booking.date[2]
                                                ).padStart(2, "0")}`}
                                            </td>
                                            <td>
                                                {`${booking.startTime[0]}:${String(booking.startTime[1]).padStart(2, "0")}`}
                                            </td>
                                            <td>
                                                {`${booking.endTime[0]}:${String(booking.endTime[1]).padStart(2, "0")}`}
                                            </td>
                                            <td>{booking.participants.join(", ")}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">No previous bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <h3>Book {selectedCourt?.name}</h3>
                    <label>
                        Start Time:
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </label>
                    <label>
                        End Time:
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </label>
                    <button onClick={handleConfirmBooking} disabled={bookingLoading}>
                        {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default BookingsPage;
