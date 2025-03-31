import { RouteObject } from 'react-router-dom';
import RoleMappingRoute from './RoleMappingRoute';
import { userRoutes } from './userRoutes';
import LandingPage from '../pages/LandingPage';
import PrivateRoute from './PrivateRoute';
import ServerNotFound from '../shared/components/ErrorPages/server-not-found/ServerNotFound';
import PageNotFound from '../shared/components/ErrorPages/page-not-found/PageNotFound';
import HomeRoute from './HomeRoutes';
import SubscriptionRoutes from './SubscriptionRoutes';

import ClubLandingRoutes from './ClubLandingRoutes';
import CreateClubRoutes from './CreateClubRoutes';
import ClubsListRoutes from './ClubsListRoutes';
import RequestsRoutes from './RequestsRoutes';
import TBDRoutes from './TBDRoutes';
import SignUpRoutes from './SignUpRoutes';
import MemberApproval from '../pages/member-approval/MemberApproval';
import BookingsPage from '../pages/bookings/BookingsPage';

const createRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      children: [{ index: true, element: <LandingPage /> }],
    },
    ...ClubLandingRoutes,
    ...CreateClubRoutes,
    ...SignUpRoutes,
    {
      element: <PrivateRoute />,
      children: [
        ...RoleMappingRoute,
        ...HomeRoute,
        ...userRoutes,
        ...SubscriptionRoutes,
        ...RequestsRoutes,
        ...ClubsListRoutes,
        ...TBDRoutes,
        {
          path: '/approve-members',
          element: <MemberApproval />,
        },
        {
          path: '/bookings',
          element: <BookingsPage />,
        },
        {
          path: '/server-not-found',
          element: <ServerNotFound />,
        },
        {
          path: '/server-not-found',
          element: <ServerNotFound />,
        },
      ],
    },
    {
      path: '*',
      element: <PageNotFound />,
    },
  ];
};

export default createRoutes;
