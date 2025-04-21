import { RouteObject } from 'react-router-dom';
;
import MemberRegistrationSignupPage from '../pages/registration/MemberRegistrationSignup';
import MemberRegistrationClubPage from '../pages/registration/MemberRegistrationClub';
import SignUp from '../features/signup/SignUp';

const SignUpRoutes: RouteObject[] = [
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/member-registration/clubs',
    element: <MemberRegistrationClubPage />,
  },
  {
    path: '/member-registration/signup',
    element: <MemberRegistrationSignupPage />,
  },
];

export default SignUpRoutes;
