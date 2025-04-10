import ClubCourtPage from '../pages/club-courts/ClubCourtPage';
import ClubDevicesPage from '../pages/club-devices/ClubDevicesPage';
import CreateClubMembershipsPage from '../pages/club-memberships-create/CreateClubMembershipsPage';
import ClubMembersPage from '../pages/clubMembersPage/ClubMembersPage';
import ClubsListPage from '../pages/clubsListPage/ClubsListPage';
const ClubsListRoutes = [
  {
    path: '/clubs',
    element: <ClubsListPage />,
  },
  {
    path: '/clubs/members/:clubId',
    element: <ClubMembersPage />,
  },
  {
    path: 'club/court',
    element: <ClubCourtPage />,
  },
  {
    path: '/club/memberships',
    element: <CreateClubMembershipsPage />,
  },
  {
    path: 'club/device',
    element: <ClubDevicesPage />,
  },
];

export default ClubsListRoutes;
