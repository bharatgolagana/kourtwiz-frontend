import { Controller, useForm } from 'react-hook-form';
import { Modal, Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useMutateAddUser } from '../../../../shared/apis/User/useMutateAddUser';
import { toast } from 'react-toastify';
import './AddUserModal.css';
import { useGetmembershipsByClubId } from '../../../../shared/apis/memberships/useGetmembershipsByClubId';
import { ref } from 'process';
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

const AddUserModal = ({
  open,
  onClose,
  currentClubId,
  onUserAdded,
}: {
  open: boolean;
  onClose: () => void;
  currentClubId: string;
  onUserAdded: () => void;
}) => {
  const { register, handleSubmit, control, formState: { errors }, } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
      currentActiveClubId: currentClubId,
      skillLevel: '',
      preferredTime: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      membershipTypeId: '',
    },
  });

  const { data: clubMembershipdata = [] } = useGetmembershipsByClubId(
    currentClubId ?? ''
    );

  const { mutate: addUserMutate } = useMutateAddUser({
    onSuccessCallback: () => {
      toast.success('User added successfully!');
      onClose();
      onUserAdded(); 
    },
    onErrorCallback: () => {
      toast.error('Failed to add user!');
    },
  });

  const onSubmit = (data: any) => {
    addUserMutate(data);
    console.log('data', data);
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box className='add-user-modal-container'>
        <Typography className='add-user-modal-title'>Create User</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className='add-user-modal-form'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label='Email' {...register('email')} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Name' {...register('name')} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      international
                      defaultCountry="US"
                      countryCallingCodeEditable={false}
                      onChange={(value) => field.onChange(value)}
                      maxLength={15}
                      error={!!errors.phoneNumber}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Date of Birth'
                type='date'
                {...register('dateOfBirth')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='skill-level-select-label'>Skill Level</InputLabel>
                <Select
                  labelId='skill-level-select-label'
                  defaultValue=""
                  {...register('skillLevel')}
                  label='Skill Level'
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Preferred Time' {...register('preferredTime')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='gender-select-label'>Gender</InputLabel>
                <Select
                  labelId='gender-select-label'
                  defaultValue=""
                  {...register('gender', { required: true })}
                  label='Gender'
                >
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Address' {...register('address')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='City' {...register('city')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='State' {...register('state')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Country' {...register('country')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Zip Code' {...register('zipCode')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='membership-select-label'>Membership</InputLabel>
              <Select
                labelId='membership-select-label'
                defaultValue=''
                {...register('membershipTypeId', { required: true })}
                label='Membership'
              >
                {clubMembershipdata.map((membership: any) => (
                  <MenuItem key={membership.id} value={membership.id}>
                    {membership.membershipName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          </Grid>

          <div className='add-user-button-group'>
            <Button onClick={onClose} variant='outlined'>
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

export default AddUserModal;
