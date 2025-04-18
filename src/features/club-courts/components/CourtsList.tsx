import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';
import { useMutateAddCourt } from '../../../shared/apis/courts/useMutateAddCourt';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from '@mui/material';
import AuthContext from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const CourtsList = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;
  const { data: clubList, isLoading, error } = useGetClubCourt(clubId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate } = useMutateAddCourt({
    onSuccessCallback: () => {
      toast.success('Court added successfully!');
      setShowModal(false);
      reset();
    },
    onErrorCallback: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    const courtData = {
      name: data.name,
      surface: data.surface,
      reservationIntervalMinutes: parseInt(data.interval, 10),
    };
    mutate({ clubId, courtData });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Courts List</h3>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setShowModal(true)}
      >
        Add New Court
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Surface</TableCell>
              <TableCell sx={{ color: 'white' }}>Interval</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: 'background.default' }}>
            {clubList?.map((court) => (
              <TableRow key={court.id}>
                <TableCell>{court.name}</TableCell>
                <TableCell>{court.surface}</TableCell>
                <TableCell>{court.reservationIntervalMinutes} mins</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Add New Court</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name', { required: true })}
              label='Name'
              fullWidth
              margin='dense'
            />
            <TextField
              {...register('surface', { required: true })}
              label='Surface'
              fullWidth
              margin='dense'
            />
            <TextField
              {...register('interval', { required: true })}
              select
              label='Interval'
              fullWidth
              margin='dense'
            >
              <MenuItem value='30'>30 minutes</MenuItem>
              <MenuItem value='60'>60 minutes</MenuItem>
              <MenuItem value='120'>120 minutes</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color='secondary'>
              Cancel
            </Button>
            <Button type='submit' color='primary' variant='contained'>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CourtsList;
