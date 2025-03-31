import { Button, TextField, Typography, Box, Grid2 } from '@mui/material';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { useSendOtpEmail } from '../../../../shared/apis/otp/useSendOtpEmail';
import { useState } from 'react';
import { useValidateOtp } from '../../../../shared/apis/otp/useValidateOtp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSendOtpSms } from '../../../../shared/apis/otp/useSendOtpSms';

interface OtpVerificationStatus {
  type: string;
  result: boolean;
}
//look into phone verification later
interface VerificationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<any>;
  handleOtpVerificationStatus: (status: OtpVerificationStatus) => void;
}
const EmailPhoneVerification: React.FC<VerificationProps> = ({
  register,
  errors,
  watch,
  handleOtpVerificationStatus,
}) => {
  const [enterEmailOtp, setEnterEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [enterPhoneOtp, setEnterPhoneOtp] = useState('');
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const { mutate: mutateSendEmailOtp, status: emailOtpStatus } =
    useSendOtpEmail({
      onSuccessCallback: () => {
        setIsEmailOtpSent(true);
        console.log('otp sent');
      },
      onErrorCallback: () => {
        setIsEmailOtpSent(false);
        console.log('error while sending the otp');
      },
    });
  const { mutate: mutateValidateOtp, status: validateOtpStatus } =
    useValidateOtp({
      onSuccessCallback: (type: string) => {
        console.log('otp validated! ', type);
        handleOtpVerificationStatus({ type, result: true });
        if (type === 'email') {
          setIsEmailVerified(true);
        } else {
          setIsPhoneVerified(true);
        }
      },
      onErrorCallback: (type: string) => {
        console.log('error while validating the otp', type);
        if (type === 'email') {
          setIsEmailVerified(false);
          handleOtpVerificationStatus({ type, result: false });
        } else {
          setIsPhoneVerified(true);
          handleOtpVerificationStatus({ type, result: true });
        }
      },
    });

  const { mutate: mutateSendPhoneOtp } = useSendOtpSms({
    onSuccessCallback: () => {
      setIsPhoneOtpSent(true);
    },
    onErrorCallback: () => {
      setIsPhoneOtpSent(false);
    },
  });
  const sendEmailOtp = () => {
    console.log('email ', watch('clubEmailId'));
    mutateSendEmailOtp({ email: watch('clubEmailId') });
  };
  const sendPhoneOtp = () => {
    console.log('sending phone otp', watch('clubPhoneNumber'));
    mutateSendPhoneOtp({ phone: watch('clubPhoneNumber') });
  };
  const handleValidateOtp = ({
    recipient,
    otp,
    type,
  }: {
    recipient: string;
    otp: string;
    type: string;
  }) => {
    mutateValidateOtp({ recipient: recipient, otp: otp, type: type });
  };
  return (
    <Box display='flex' flexDirection='column' gap={3} alignItems='center'>
      <Typography variant='h6' gutterBottom color='white'>
        Verify Email
      </Typography>
      <Grid2 container spacing={2} alignItems='center'>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            {...register('clubEmailId')}
            value={watch('clubEmailId')}
            disabled
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => sendEmailOtp()}
            loading={emailOtpStatus == 'pending'}
          >
            Send OTP
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isEmailOtpSent && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} alignItems={'center'}>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            value={enterEmailOtp}
            onChange={(e) => {
              setEnterEmailOtp(e.target.value);
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => {
              handleValidateOtp({
                recipient: watch('clubEmailId'),
                otp: enterEmailOtp,
                type: 'email',
              });
            }}
            loading={validateOtpStatus === 'pending'}
          >
            Verify
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isEmailVerified && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
      <Typography variant='h6' color='white' gutterBottom>
        Verify Phone
      </Typography>
      {/* Phone Verification */}
      <Grid2 container spacing={2} alignItems='center'>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            {...register('clubPhoneNumber')}
            value={watch('clubPhoneNumber')}
            disabled
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              sendPhoneOtp();
            }}
            fullWidth
            sx={{ mt: 1 }}
          >
            Send OTP
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isPhoneOtpSent && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2} alignItems={'center'}>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            value={enterPhoneOtp}
            onChange={(e) => {
              setEnterPhoneOtp(e.target.value);
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 3 }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => {
              handleValidateOtp({
                recipient: watch('clubPhoneNumber'),
                otp: enterPhoneOtp,
                type: 'phone',
              });
            }}
          >
            Verify
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isPhoneVerified && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default EmailPhoneVerification;
