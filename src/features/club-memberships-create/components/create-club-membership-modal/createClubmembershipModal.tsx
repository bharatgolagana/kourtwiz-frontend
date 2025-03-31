const CreateClubmembershipModal = () => {
  return (
    <>
      <h1>Create Membership Modal</h1>
    </>
  );
};

export default CreateClubmembershipModal;

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from '@mui/material';

const MembershipFormModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingCycle: '',
    maxCourts: '',
    guestCheckIns: '',
    priorityBooking: false,
    supportLevel: '',
    features: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, priorityBooking: e.target.checked });
  };

  const handleMultiSelectChange = (e) => {
    setFormData({ ...formData, features: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Create Membership
        </Typography>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label='Price'
              name='price'
              type='number'
              value={formData.price}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Billing Cycle</InputLabel>
              <Select
                name='billingCycle'
                value={formData.billingCycle}
                onChange={handleChange}
              >
                <MenuItem value='MONTHLY'>Monthly</MenuItem>
                <MenuItem value='QUARTERLY'>Quarterly</MenuItem>
                <MenuItem value='YEARLY'>Yearly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label='Max Courts'
              name='maxCourts'
              type='number'
              value={formData.maxCourts}
              onChange={handleChange}
            />
          </Grid>
          {/* Right Column */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Guest Check-Ins'
              name='guestCheckIns'
              type='number'
              value={formData.guestCheckIns}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.priorityBooking}
                  onChange={handleCheckboxChange}
                />
              }
              label='Priority Booking'
            />
            <TextField
              fullWidth
              label='Support Level'
              name='supportLevel'
              value={formData.supportLevel}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Features</InputLabel>
              <Select
                multiple
                name='features'
                value={formData.features}
                onChange={handleMultiSelectChange}
              >
                <MenuItem value='PRIORITY_BOOKING'>Priority Booking</MenuItem>
                <MenuItem value='DISCOUNT'>Discount</MenuItem>
                <MenuItem value='EXCLUSIVE_EVENTS'>Exclusive Events</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={2} display='flex' justifyContent='space-between'>
          <Button onClick={onClose} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MembershipFormModal;
