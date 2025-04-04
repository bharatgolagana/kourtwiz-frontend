import { useContext } from "react";
import "./WaitList.css";
import AuthContext from "../../context/AuthContext";
import {useGetWaitlist} from "../../features/waitlist/api/useGetWaitlist"

const ClubParticipantsTable = () => {
    const { user } = useContext(AuthContext)!;
    const userId = user?.userId;

    if (!user) {
        return <p>Loading...</p>;
    }


    const { data: WaitlistData, isLoading: isLoading, error: isError } = useGetWaitlist(userId);

  return (
    <div className="ClubSchedulePage">
      <h2>Session Participants</h2>
      <div className="table-container">
        {WaitlistData?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Session </th>
                <th>Participant</th>
                <th>Joined At</th>
              </tr>
            </thead>
            <tbody>
              {WaitlistData.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.sessionId}</td>
                  <td>{participant.userId}</td>
                  <td>{new Date(participant.joinedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No participants found.</p>
        )}
      </div>
    </div>
  );
};

export default ClubParticipantsTable;
