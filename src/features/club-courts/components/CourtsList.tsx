import { useUserInfo } from '../../../context/UserInfoContext';
import { useGetClubCourt } from '../../../shared/apis/courts/useGetClubCourts';

const CourtsList = () => {
  const { userInfo } = useUserInfo();
  const { data: clubList, isLoading } = useGetClubCourt(
    '67e66d174ac81260061a2a8c'
  );
  console.log('club list ', clubList);
  console.log('userInfo : ', userInfo);
  return <>Courts list</>;
};

export default CourtsList;
