import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Modal,
} from '@mui/material';
import SubscriptionCard from '../features/subscription/subscription-card';
import { useEffect, useState } from 'react';

const subscriptionPlans = [
  {
    id: 1,
    name: 'Club Admin',
    price: '$9.99 / month',
    details: ['Access to basic features', 'Email support', 'Limited usage'],
  },
  {
    id: 2,
    name: 'Member',
    price: '$19.99 / month',
    details: [
      'Access to all features',
      'Priority email support',
      'Unlimited usage',
    ],
  },
  {
    id: 3,
    name: 'Enterprise Plan',
    price: '$49.99 / month',
    details: [
      'Customized solutions',
      'Dedicated support',
      'Unlimited usage + analytics',
    ],
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SubscriptionPage = () => {
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handlePayment = (plan) => {
    console.log('handle payment is called');
    handleOpen();
    // alert(`You selected the ${plan.name} for ${plan.price}`);
    // You can hook this into a payment gateway here!
  };

  const [openMoal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Modal
        keepMounted
        open={openMoal}
        onClose={handleClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={style}>
          <Typography id='keep-mounted-modal-title' variant='h6' component='h2'>
            Choose your Organization
          </Typography>
          <Typography id='keep-mounted-modal-description' sx={{ mt: 2 }}>
            Organization names...
          </Typography>
          <Button onClick={() => handleClose()}>Proceed</Button>
        </Box>
      </Modal>
      <Typography variant='h4' align='center' gutterBottom>
        Choose Your Subscription
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        {subscriptionPlans.map((plan) =>
          SubscriptionCard({ plan, handlePayment })
        )}
      </Grid>
    </Box>
  );
};

export default SubscriptionPage;
