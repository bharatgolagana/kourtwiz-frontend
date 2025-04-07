import { RouteObject } from 'react-router-dom';
import PreviousCoachBookings from '../pages/previous-coach-bookings/PreviousCoachBookings';


const PreviousCoachBookingsRoutes: RouteObject[] = [
  {
    path: 'previous-coach-bookings',
    element: <PreviousCoachBookings />,
  },
];

export default PreviousCoachBookingsRoutes;