import { useForm, Controller } from 'react-hook-form';
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

const MEMBERSHIP_BENEFITS = [
  'PRIORITY_BOOKING',
  'DISCOUNT',
  'GUEST_ACCESS',
  'FAMILY_ACCESS',
  'TOURNAMENT_DISCOUNT',
];

const UPGRADE_OPTIONS = ['Silver', 'Gold'];

const CreateClubMembershipModal = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      durationInDays: '',
      benefits: [],
      isFamilyPlan: false,
      maxFamilyMembers: '',
      guestPasses: '',
      discountPercentage: '',
      autoRenewalAllowed: false,
      upgradableTo: [],
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={6}>
              <TextField fullWidth label='Name' {...register('name')} />
              <TextField
                fullWidth
                label='Description'
                {...register('description')}
              />
              <TextField
                fullWidth
                label='Price'
                type='number'
                {...register('price')}
              />
              <TextField
                fullWidth
                label='Duration (Days)'
                type='number'
                {...register('durationInDays')}
              />
              <FormControl fullWidth>
                <InputLabel>Benefits</InputLabel>
                <Controller
                  name='benefits'
                  control={control}
                  render={({ field }) => (
                    <Select multiple {...field}>
                      {MEMBERSHIP_BENEFITS.map((benefit) => (
                        <MenuItem key={benefit} value={benefit}>
                          {benefit}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox {...register('isFamilyPlan')} />}
                label='Family Plan'
              />
              <TextField
                fullWidth
                label='Max Family Members'
                type='number'
                {...register('maxFamilyMembers')}
              />
              <TextField
                fullWidth
                label='Guest Passes'
                type='number'
                {...register('guestPasses')}
              />
              <TextField
                fullWidth
                label='Discount %'
                type='number'
                {...register('discountPercentage')}
              />
              <FormControlLabel
                control={<Checkbox {...register('autoRenewalAllowed')} />}
                label='Auto Renewal Allowed'
              />
              <FormControl fullWidth>
                <InputLabel>Upgradable To</InputLabel>
                <Controller
                  name='upgradableTo'
                  control={control}
                  render={({ field }) => (
                    <Select multiple {...field}>
                      {UPGRADE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={2} display='flex' justifyContent='space-between'>
            <Button onClick={onClose} variant='outlined'>
              Cancel
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateClubMembershipModal;
