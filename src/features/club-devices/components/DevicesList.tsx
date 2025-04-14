import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  Chip,
  Box,
} from '@mui/material';
import './DevicesList.css';

import AuthContext from '../../../context/AuthContext';
import { useMutateAddDevice } from '../api/useMutateAddDevice';
import { useGetClubDevices } from '../api/useGetClubDevices';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';
import { toast } from 'react-toastify';
import { useMutateDeleteDevice } from '../api/useMutateDeleteDevice';

const DEVICE_TYPES = ['CAMERA', 'SWITCH', 'LIGHT'];
const DEVICE_STATUSES = ['Online', 'Offline', 'Error'];

const DevicesList = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;
  const [selectedCourt, setSelectedCourt] = useState<string[]>([]);

  const { mutate: deleteDevice } = useMutateDeleteDevice({
    onSuccessCallback: () => toast.success('Device deleted successfully!'),
    onErrorCallback: (error) => toast.error(`Delete failed: ${error.message}`),
  });
  
  const { data: deviceList, isLoading, error } = useGetClubDevices(clubId);
  const { data: courtList = [] } = useGetClubCourt(clubId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: addDevice } = useMutateAddDevice({
    onSuccessCallback: () => {
      toast.success('Device added successfully!');
      setShowModal(false);
      reset();
    },
    onErrorCallback: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    const deviceData = {
      name: data.name,
      type: data.type,
      status: data.status,
      clubId,
      courtId: data.courtId,
    };
    addDevice(deviceData);
  };

  const getCourtName = (courtId) => {
    const court = courtList.find((c) => c.id === courtId);
    return court ? court.name : 'Unknown';
  };

  if (isLoading) return <p>Loading devices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Devices List</h3>
      <div className='Buttons'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setShowModal(true)}
        className='add-device'
      >
        Add New Device
      </Button>
      <TextField
      select
      label="Filter by Court"
      value={selectedCourt}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedCourt(typeof value === 'string' ? value.split(',') : value);
      }}
      SelectProps={{
        multiple: true,
        renderValue: (selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((courtId) => {
              const court = courtList.find((c) => c.id === courtId);
              return (
                <Chip
                  key={courtId}
                  label={court ? court.name : 'Unknown'}
                  size="small"
                  sx={{ backgroundColor: '#e0f7fa', color: '#006064' }}
                />
              );
            })}
          </Box>
        ),
      }}
      style={{ marginTop: '20px', minWidth: '300px' }}
    >
      {courtList.map((court) => (
        <MenuItem key={court.id} value={court.id}>
          {court.name}
        </MenuItem>
      ))}
    </TextField>
    </div>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Court</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {deviceList
            ?.filter((device) =>
              selectedCourt.length === 0 ? true : selectedCourt.includes(device.courtId)
            )
            .map((device) => (

              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{getCourtName(device.courtId)}</TableCell>
                <TableCell>
                <Button
                  variant='outlined'
                  color='error'
                  size='small'
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this device?')) {
                      deleteDevice(device.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Add New Device</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name', { required: true })}
              label='Device Name'
              fullWidth
              margin='dense'
              error={!!errors.name}
              helperText={errors.name && 'Name is required'}
            />
            <TextField
              {...register('type', { required: true })}
              select
              label='Type'
              fullWidth
              margin='dense'
              error={!!errors.type}
              helperText={errors.type && 'Type is required'}
            >
              {DEVICE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register('status', { required: true })}
              select
              label='Status'
              fullWidth
              margin='dense'
              defaultValue='Online'
              error={!!errors.status}
              helperText={errors.status && 'Status is required'}
            >
              {DEVICE_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register('courtId', { required: true })}
              select
              label='Court'
              fullWidth
              margin='dense'
              error={!!errors.courtId}
              helperText={errors.courtId && 'Court is required'}
            >
              {courtList.map((court) => (
                <MenuItem key={court.id} value={court.id}>
                  {court.name}
                </MenuItem>
              ))}
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

export default DevicesList;
