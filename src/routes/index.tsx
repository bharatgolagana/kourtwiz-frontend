import { RouteObject } from "react-router-dom";
import RoleMappingRoute from "./RoleMappingRoute";
import { userRoutes } from "./userRoutes";
import LandingPage from "../pages/LandingPage";
import PrivateRoute from "./PrivateRoute";
import ServerNotFound from "../shared/components/ErrorPages/server-not-found/ServerNotFound";
import PageNotFound from "../shared/components/ErrorPages/page-not-found/PageNotFound";
import HomeRoute from "./HomeRoutes";
import SignUpRoutes from "./SIgnUpRoutes"

const createRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      children: [{ index: true, element: <LandingPage /> }],
    },
    ...SignUpRoutes,
    {
      element: <PrivateRoute />,
      children: [
        ...RoleMappingRoute,
        ...HomeRoute,
        ...userRoutes,

        {
          path: "/server-not-found",
          element: <ServerNotFound />,
        },
        {
          path: "/server-not-found",
          element: <ServerNotFound />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ];
};

export default createRoutes;
