import { RouteObject } from "react-router-dom";
import SignUp from "../features/signup/signup";

const SignUpRoutes: RouteObject[] = [
  {
    path: "/signup",
    element: <SignUp />,
  },
];

export default SignUpRoutes;
