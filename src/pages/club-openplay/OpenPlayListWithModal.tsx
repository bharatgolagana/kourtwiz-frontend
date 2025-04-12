import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CreateOpenPlay from "./CreateOpenPlay";
import "./CreateOpenPlay.css";
import AuthContext from "../../context/AuthContext";
import Modal from "../../features/bookings/components/Modal";
import { fetchCourts } from "../../features/booking-calendar/api/getCourts";

function OpenPlayListWithModal() {
  const { user } = useContext(AuthContext) || {};
  const clubId = user?.userClubRole?.[0]?.clubId ?? "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [courts, setCourts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clubId) {
      fetchAvailableSessions();
      fetchCourtsList();
    }
  }, [clubId]);

  const fetchAvailableSessions = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `http://44.216.113.234:8080/api/play-type/sessions/available?clubId=${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions(response.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchCourtsList = async () => {
    try {
      if (!clubId) return;
      const courtsData = await fetchCourts(clubId);
      const courtMap = courtsData.reduce((acc: { [key: string]: string }, court: { id: string; title: string }) => {
        acc[court.id] = court.title;
        return acc;
      }, {});
      setCourts(courtMap);
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  const formatDateTime = (startTime: number[]) => {
    const [year, month, day, hour, minute] = startTime;
    const date = new Date(year, month - 1, day, hour, minute);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchAvailableSessions();
  };

  return (
    <div className="openplay-container">
      <div className="list-header">
        <h2>Play Sessions</h2>
        <button onClick={() => setIsModalOpen(true)} className="create-btn">
          + Create Play
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>Play Type</th>
              <th>Skill Level</th>
              <th>Duration (mins)</th>
              <th>Price ($)</th>
              <th>Court</th>
              <th>Max Slots</th>
              <th>Filled Slots</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const { date, time } = formatDateTime(session.startTime);
              const filledSlots = session.registeredPlayers?.length ?? 0;
              const courtName = courts[session.courtId] || "Unknown Court";

              return (
                <tr key={session.id}>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{session.playTypeName}</td>
                  <td>{session.skillLevel}</td>
                  <td>{session.durationMinutes}</td>
                  <td>{session.priceForPlay}</td>
                  <td>{courtName}</td>
                  <td>{session.maxPlayers}</td>
                  <td>{filledSlots}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CreateOpenPlay onSuccess={handleSuccess} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default OpenPlayListWithModal;
