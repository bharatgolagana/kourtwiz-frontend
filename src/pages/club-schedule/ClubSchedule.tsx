import React, { useContext } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { useGetClubBookings } from '../../features/ClubBookings/api/useGetClubBookings';
import { useGetCourts } from '../../features/bookings/api/useGetCourts';

const ClubSchedulePage = () => {
  const { user } = useContext(AuthContext)!;

  if (!user) return <Typography>Loading user...</Typography>;

  const clubId = user?.userClubRole?.[0]?.clubId ?? '';

  const {
    data: clubBookingData,
    isLoading,
    error,
  } = useGetClubBookings(clubId);
  const { data: courtsData } = useGetCourts(clubId);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant='h4' color='primary.main' gutterBottom>
        Club Bookings
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity='error'>Error loading bookings: {error.message}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Court</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Start Time</TableCell>
                <TableCell sx={{ color: 'white' }}>End Time</TableCell>
                <TableCell sx={{ color: 'white' }}>Participants</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubBookingData?.map((booking: any) => {
                const courtName = courtsData?.find(
                  (court: any) => court.id === booking.courtId
                )?.name;

                return (
                  <TableRow
                    key={booking.id}
                    sx={{ bgcolor: 'background.default' }}
                  >
                    <TableCell>{courtName ?? 'N/A'}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.startTime}</TableCell>
                    <TableCell>{booking.endTime}</TableCell>
                    <TableCell>{booking.participants.length}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ClubSchedulePage;
