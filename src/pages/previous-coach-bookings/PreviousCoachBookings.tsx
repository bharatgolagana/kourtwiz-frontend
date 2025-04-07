import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchCoaches } from "../../features/coach-booking-calendar/api/getCoaches";
import { fetchPreviousCoachBookings } from "../../features/coach-booking-calendar/api/getPreviousCoachBookings";
import "./PreviousCoachBookings.css";

const PreviousCoachBookings = () => {
    const { user } = useContext(AuthContext)!;
    const clubId = user?.currentActiveClubId;

    const [bookings, setBookings] = useState([]);
    const [coachesMap, setCoachesMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            const coaches = await fetchCoaches(clubId!); 
            const bookingsData = await fetchPreviousCoachBookings(clubId!);
            const coachIdToName: Record<string, string> = {};
            coaches.forEach((coach: any) => {
                coachIdToName[coach.id] = coach.name;
            });
            setCoachesMap(coachIdToName);
            setBookings(bookingsData);
        };
        loadData();
    }, [clubId]);
    

    return (
        <div className="bookings-container">
            <h2>Previous Coach Bookings</h2>
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>Coach Name</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking: any) => (
                        <tr key={booking.id}>
                            <td>{coachesMap[booking.coachId]}</td>
                            <td>{booking.date}</td>
                            <td>{new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{new Date(booking.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PreviousCoachBookings;
