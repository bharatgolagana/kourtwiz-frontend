import { RouteObject } from 'react-router-dom';
import RoleMappingRoute from './RoleMappingRoute';
import { userRoutes } from './userRoutes';
import LandingPage from '../pages/LandingPage';
import PrivateRoute from './PrivateRoute';
import ServerNotFound from '../shared/components/ErrorPages/server-not-found/ServerNotFound';
import PageNotFound from '../shared/components/ErrorPages/page-not-found/PageNotFound';
import HomeRoute from './HomeRoutes';
import SubscriptionRoutes from './SubscriptionRoutes';

const createRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      children: [{ index: true, element: <LandingPage /> }],
    },

    {
      element: <PrivateRoute />,
      children: [
        ...RoleMappingRoute,
        ...HomeRoute,
        ...userRoutes,
        ...SubscriptionRoutes,

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
