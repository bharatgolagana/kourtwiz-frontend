import { RouteObject } from 'react-router-dom';
import OpenPlayBookingsPage from '../pages/openplay-bookings/OpenPlayBookingsPage';



const OpenplayBookingRoutes: RouteObject[] = [
  {
    path: 'open-play/bookings',
    element: <OpenPlayBookingsPage />,
  },
];

export default OpenplayBookingRoutes;