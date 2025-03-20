import { RouteObject } from "react-router-dom";
import ClubLandingPage from "../features/Clubs-Landing-Page/ClubLandingPage";

const ClubsRoute: RouteObject[] = [
  {
    path: "/clubs/:id",
    element: <ClubLandingPage />,
  },
];

export default ClubsRoute;
