import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CreateOpenPlay from './CreateOpenPlay';
import './CreateOpenPlay.css';
import AuthContext from '../../context/AuthContext';
import Modal from '../../features/bookings/components/Modal';
import { fetchCourts } from '../../features/booking-calendar/api/getCourts';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const tableCellStyle = {
  color: 'primary',
  fontWeight: 'bold',
};
function OpenPlayListWithModal() {
  const { user } = useContext(AuthContext) || {};
  const clubId = user?.userClubRole?.[0]?.clubId ?? '';

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
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');

      const response = await axios.get(
        `http://44.216.113.234:8080/api/play-type/sessions/available?clubId=${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const fetchCourtsList = async () => {
    try {
      if (!clubId) return;
      const courtsData = await fetchCourts(clubId);
      const courtMap = courtsData.reduce(
        (
          acc: { [key: string]: string },
          court: { id: string; title: string }
        ) => {
          acc[court.id] = court.title;
          return acc;
        },
        {}
      );
      setCourts(courtMap);
    } catch (err) {
      console.error('Error fetching courts:', err);
    }
  };

  const formatDateTime = (startTime: number[]) => {
    const [year, month, day, hour, minute] = startTime;
    const date = new Date(year, month - 1, day, hour, minute);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchAvailableSessions();
  };

  return (
    <div className='openplay-container'>
      <div className='list-header'>
        <Typography variant='h4'>Play Sessions</Typography>
        <Button variant='contained' onClick={() => setIsModalOpen(true)}>
          + Create Play
        </Button>
      </div>

      <div style={{ padding: '1rem' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell style={tableCellStyle}>Date</TableCell>
                <TableCell style={tableCellStyle}>Start Time</TableCell>
                <TableCell style={tableCellStyle}>Play Type</TableCell>
                <TableCell style={tableCellStyle}>Skill Level</TableCell>
                <TableCell style={tableCellStyle}>Duration (mins)</TableCell>
                <TableCell style={tableCellStyle}>Price ($)</TableCell>
                <TableCell style={tableCellStyle}>Court</TableCell>
                <TableCell style={tableCellStyle}>Max Slots</TableCell>
                <TableCell style={tableCellStyle}>Filled Slots</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => {
                const { date, time } = formatDateTime(session.startTime);
                const filledSlots = session.registeredPlayers?.length ?? 0;
                const courtName = courts[session.courtId] || 'Unknown Court';

                return (
                  <TableRow key={session.id}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>{session.playTypeName}</TableCell>
                    <TableCell>{session.skillLevel}</TableCell>
                    <TableCell>{session.durationMinutes}</TableCell>
                    <TableCell>{session.priceForPlay}</TableCell>
                    <TableCell>{courtName}</TableCell>
                    <TableCell>{session.maxPlayers}</TableCell>
                    <TableCell>{filledSlots}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CreateOpenPlay
            onSuccess={handleSuccess}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default OpenPlayListWithModal;
