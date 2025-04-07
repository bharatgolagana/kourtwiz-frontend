import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserInfo } from '../../../context/UserInfoContext';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';
import { useMutateAddCourt } from '../../../shared/apis/courts/useMutateAddCourt';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CourtsList = () => {
  const { userInfo } = useUserInfo();
  const { data: clubList, isLoading, error } = useGetClubCourt('67e66d174ac81260061a2a8c');
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutate } = useMutateAddCourt({
    onSuccessCallback: () => {
      alert('Court added successfully!');
      setShowModal(false);
      reset();
    },
    onErrorCallback: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    console.log('booking court : ', data);
    const courtData = {
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      type: data.type,
      capacity: data.capacity,
      surface: data.surface,
      pricePerHour: parseFloat(data.pricePerHour),
      reservationIntervalMinutes: 1073741824, // Fixed value
      openingTime: data.openingTime + ' AM',
      closingTime: data.closingTime + ' PM',
      blockedDates: blockedDatesArray,
      available: data.available === 'true',
    };
    mutate({ clubId: '67e66d174ac81260061a2a8c', courtData });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Courts List</h3>
      <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
        Add New Court
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Surface</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price/Hour</TableCell>
              <TableCell>Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubList?.map((court) => (
              <TableRow key={court.id}>
                <TableCell>{court.name}</TableCell>
                <TableCell>{court.type}</TableCell>
                <TableCell>{court.surface}</TableCell>
                <TableCell>{court.capacity}</TableCell>
                <TableCell>${court.pricePerHour}</TableCell>
                <TableCell>{court.available ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Add New Court</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField {...register('name', { required: true })} label="Name" fullWidth margin="dense" />
            <TextField {...register('slug', { required: true })} label="Slug" fullWidth margin="dense" />
            <TextField {...register('type', { required: true })} select label="Type" fullWidth margin="dense">
              <MenuItem value="Singles">Singles</MenuItem>
              <MenuItem value="Doubles">Doubles</MenuItem>
              <MenuItem value="Singles & Doubles">Singles & Doubles</MenuItem>
            </TextField>
            <TextField {...register('capacity', { required: true })} label="Capacity" type="number" fullWidth margin="dense" inputProps={{ min: 0 }} />
            <TextField {...register('surface', { required: true })} label="Surface" fullWidth margin="dense" />
            <TextField {...register('pricePerHour', { required: true })} label="Price per Hour" type="number" fullWidth margin="dense" inputProps={{ min: 0 }}/>
            <TextField {...register('available', { required: true })} select label="Available" fullWidth margin="dense">
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CourtsList;
