import { RouteObject } from 'react-router-dom';
import ClubSchedulePage from '../pages/club-schedule/ClubSchedule';


const SubscriptionRoutes: RouteObject[] = [
  {
    path: 'club-bookings',
    element: <ClubSchedulePage />,
  },
];

export default SubscriptionRoutes;