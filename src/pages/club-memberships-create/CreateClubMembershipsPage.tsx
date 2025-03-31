import { useGetmembershipsByClubId } from '../../shared/apis/memberships/useGetmembershipsByClubId';
import { Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './CreateClubMembershipsPage.css';
import CreateClubmembershipModal from '../../features/club-memberships-create/components/create-club-membership-modal/createClubmembershipModal';
import { useContext, useState } from 'react';
import { useMutateCreateClubMembership } from '../../shared/apis/memberships/useMutateCreateClubMembership';
import AuthContext from '../../context/AuthContext';

const CreateClubMembershipsPage = () => {
  const { user } = useContext(AuthContext)!;
  const currentClubId = user?.currentActiveClubId;
  const { data: clubMembershipdata, isLoading } = useGetmembershipsByClubId(
    currentClubId ?? ''
  );
  const [openCreateMembershipModal, setOpenCreateMembershipModal] =
    useState(false);
  const onCloseModal = () => setOpenCreateMembershipModal(false);

  const { mutate: createMembership } = useMutateCreateClubMembership({
    clubId: currentClubId,
    onSuccessCallback: () => {
      onCloseModal();
    },
    onErrorCallback: () => {
      onCloseModal();
    },
  });
  const onSubmit = (data: any) => {
    createMembership(data);
  };
  if (isLoading || !user) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Your Club Memberships
      </h2>
      <div className='club-memberships-container'>
        {clubMembershipdata?.map((membership: any) => (
          <Card key={membership.id} className='membership-card'>
            <CardContent>
              <Typography variant='h5'>{membership.name}</Typography>
              <Typography variant='body2'>{membership.description}</Typography>
              <Typography variant='body1'>
                Price: ${membership.price}
              </Typography>
              <Typography variant='body2'>
                Duration: {membership.durationInDays} days
              </Typography>
            </CardContent>
          </Card>
        ))}
        <CreateClubmembershipModal
          open={openCreateMembershipModal}
          onClose={onCloseModal}
          onSubmit={onSubmit}
        />
        <div
          className='add-membership-card'
          onClick={() => setOpenCreateMembershipModal(true)}
        >
          <AddIcon fontSize='inherit' />
        </div>
      </div>
    </div>
  );
};

export default CreateClubMembershipsPage;
