import { RouteObject } from "react-router-dom";
import Home from "../features/home/home";

const HomeRoute: RouteObject[] = [
  {
    path: "home",
    element: <Home />,
  },
];

export default HomeRoute;
