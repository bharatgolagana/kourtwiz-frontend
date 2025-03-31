import React, { useContext, useState } from 'react';
import { useGetUsersByClubId } from '../../../../shared/apis/User/useGetUsersByClubId';
import AuthContext from '../../../../context/AuthContext';
import Viewusers from '../view-users/ViewUsers';
import AddUserModal from '../AddUserModal/AddUserModal';

const UserManagement: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const currentClubId = user?.currentActiveClubId;
  const [openAddUserModal, setopenAddUserModal] = useState(false);
  const handleCloseModal = () => setopenAddUserModal(false);
  const handleOpenModal = () => {
    console.log('opening the modal');
    setopenAddUserModal(true);
  };
  const { data: users, isLoading } = useGetUsersByClubId(currentClubId);
  if (isLoading || !currentClubId) return <>Loading...</>;
  return (
    <div>
      <p>Welcome to the User Management page!</p>
      <AddUserModal
        open={openAddUserModal}
        onClose={handleCloseModal}
        currentClubId={currentClubId}
      />
      <Viewusers data={users} handleOpenModal={handleOpenModal} />
    </div>
  );
};

export default UserManagement;
