import { RouteObject } from 'react-router-dom';
import MyReservations from '../features/my-reservations/components/MyReservations';


const MyBookingsRoutes: RouteObject[] = [
  {
    path: 'my-bookings',
    element: <MyReservations />,
  },
];

export default MyBookingsRoutes;