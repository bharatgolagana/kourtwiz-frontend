import { useLocation } from 'react-router-dom';

const MemberRegistrationSignupPage = () => {
  const location = useLocation();
  const { clubId, clubName } = location.state || {};
  console.log('club Id, club name ', clubId, clubName);
  return <>Member registration signup page</>;
};

export default MemberRegistrationSignupPage;
