import ClubMembersPage from "../pages/clubMembersPage/ClubMembersPage";
import ClubsListPage from "../pages/clubsListPage/ClubsListPage";

const ClubsListRoutes = [
  {
    path: "/clubs",
    element: <ClubsListPage />,
  },
  {
    path: "/clubs/members/:clubId",
    element: <ClubMembersPage />,
  },
];

export default ClubsListRoutes;
