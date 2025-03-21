import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Typography, Box } from '@mui/material';
import './MemberRegistrationSignup.css';
import { useMutateSignUpMember } from '../../features/member-registration/api/useMutateSignupMember';
import { toast } from 'react-toastify';

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof schema>;

const MemberRegistrationSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clubId, clubName } = location.state || {};
  const { mutate } = useMutateSignUpMember({
    onSuccessCallback: () => {
      toast.success('Member created! please wait for approval..');
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    },
    onErrorCallback: () => {
      toast.error('error while assing role');
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    mutate({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phoneNumber,
      password: data.password,
      organizationId: clubId,
    });
  };

  return (
    <div className='signup-container'>
      <img
        src='/src/assets/memberSignup.jpg'
        alt='Background'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: '.4',
        }}
      />
      <div className='signup-form'>
        <Typography variant='h4' className='company-name'>
          {clubName || 'Company Name'}
        </Typography>
        <Typography variant='h6' className='signup-heading'>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box className='name-row'>
            <TextField
              label='First Name'
              variant='outlined'
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputLabelProps={{ shrink: true }}
              className='half-width'
              fullWidth
            />
            <TextField
              label='Last Name'
              variant='outlined'
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputLabelProps={{ shrink: true }}
              className='half-width'
              fullWidth
            />
          </Box>
          <Box className='form-field'>
            <TextField
              label='Email'
              variant='outlined'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          <Box className='form-field'>
            <TextField
              label='Phone Number'
              variant='outlined'
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
              className='form-field'
            />
          </Box>
          <Box className='form-field'>
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
              className='form-field'
            />
          </Box>
          <Box className='form-field'>
            <TextField
              label='Confirm Password'
              type='password'
              variant='outlined'
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
              className='form-field'
            />
          </Box>

          <Button
            type='submit'
            variant='contained'
            color='primary'
            className='submit-button'
            fullWidth
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MemberRegistrationSignupPage;
