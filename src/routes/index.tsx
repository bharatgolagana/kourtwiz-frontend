import { RouteObject } from "react-router-dom";
import RoleMappingRoute from "./RoleMappingRoute";
import { userRoutes } from "./userRoutes";
import LandingPage from "../pages/LandingPage";
import PrivateRoute from "./PrivateRoute";
import ServerNotFound from "../shared/components/ErrorPages/server-not-found/ServerNotFound";
import PageNotFound from "../shared/components/ErrorPages/page-not-found/PageNotFound";
import HomeRoute from "./HomeRoutes";
import RegisterPage from "../pages/registerPage";
import OrganizationRegistration from "../pages/OrganizationRegistration";

const createRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      children: [
        { index: true, element: <LandingPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "register/organization", element: <OrganizationRegistration /> },
      ],
    },

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
