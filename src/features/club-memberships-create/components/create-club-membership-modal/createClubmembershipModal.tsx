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
} from '@mui/material';
import './createClubMembershipModal.css';

const MEMBERSHIP_BENEFITS = [
  'PRIORITY_BOOKING',
  'DISCOUNT',
  'GUEST_ACCESS',
  'FAMILY_ACCESS',
  'TOURNAMENT_DISCOUNT',
];

const UPGRADE_OPTIONS = ['Silver', 'Gold'];

const CreateClubMembershipModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
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

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='modal-container'>
        <Typography className='modal-title'>Create Membership</Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='modal-form'>
          <TextField
            label='Name'
            {...register('name')}
            className='full-width'
          />
          <TextField
            label='Description'
            {...register('description')}
            className='full-width'
          />
          <TextField label='Price' type='number' {...register('price')} />
          <TextField
            label='Duration (Days)'
            type='number'
            {...register('durationInDays')}
          />

          <FormControl className='full-width'>
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

          <FormControlLabel
            control={<Checkbox {...register('isFamilyPlan')} />}
            label='Family Plan'
            className='checkbox-group'
          />
          <TextField
            label='Max Family Members'
            type='number'
            {...register('maxFamilyMembers')}
          />
          <TextField
            label='Guest Passes'
            type='number'
            {...register('guestPasses')}
          />
          <TextField
            label='Discount %'
            type='number'
            {...register('discountPercentage')}
          />

          <FormControlLabel
            control={<Checkbox {...register('autoRenewalAllowed')} />}
            label='Auto Renewal Allowed'
            className='checkbox-group'
          />

          <FormControl className='full-width'>
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

          <div className='button-group-create-membership full-width'>
            <Button onClick={() => onClose()} variant='outlined'>
              Cancel
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateClubMembershipModal;
