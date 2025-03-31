import React, { useContext } from 'react';
import { useGetUsersByClubId } from '../../../../shared/apis/User/useGetUsersByClubId';
import AuthContext from '../../../../context/AuthContext';
import Viewusers from '../view-users/ViewUsers';

const UserManagement: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const currentClubId = user?.currentActiveClubId;
  const { data: users, isLoading } = useGetUsersByClubId(currentClubId);
  if (isLoading || !currentClubId) return <>Loading...</>;
  return (
    <div>
      <p>Welcome to the User Management page!</p>
      <Viewusers data={users} />
    </div>
  );
};

export default UserManagement;
