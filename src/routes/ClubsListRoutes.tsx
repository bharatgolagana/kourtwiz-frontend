import ClubCourtPage from '../pages/club-courts/ClubCourtPage';
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
];

export default ClubsListRoutes;
