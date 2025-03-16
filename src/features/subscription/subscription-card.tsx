import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { JSX } from 'react';
type SubscriptionPlan = {
  id: number;
  name: string;
  price: string;
  details: string[];
};
const SubscriptionCard = ({ plan, handlePayment }): JSX.Element => {
  return (
    <Grid item xs={12} sm={6} md={4} key={plan.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant='h5' gutterBottom>
            {plan.name}
          </Typography>

          <Typography variant='h6' color='primary' gutterBottom>
            {plan.price}
          </Typography>

          <Box component='ul' sx={{ pl: 2 }}>
            {plan.details.map((detail, idx) => (
              <li key={idx}>
                <Typography variant='body2'>{detail}</Typography>
              </li>
            ))}
          </Box>
        </CardContent>

        <CardActions>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => {
              handlePayment(plan);
            }}
          >
            Pay Now
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default SubscriptionCard;
