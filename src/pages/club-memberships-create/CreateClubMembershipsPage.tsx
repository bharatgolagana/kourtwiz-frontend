import { useGetmembershipsByClubId } from '../../shared/apis/memberships/useGetmembershipsByClubId';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './CreateClubMembershipsPage.css';
import CreateClubmembershipModal from '../../features/club-memberships-create/components/create-club-membership-modal/createClubmembershipModal';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const CreateClubMembershipsPage = () => {
  const { user } = useContext(AuthContext)!;
  const currentClubId = user?.currentActiveClubId;

  const { data: clubMembershipdata, isLoading } = useGetmembershipsByClubId(
    currentClubId ?? ''
  );
  const perkLabels: Record<string, string> = {
    advanceBookingDays: 'Advance Booking (Days)',
    openPlaySessionsAllowed: 'Open Play Sessions Allowed',
    tournamentAccess: 'Tournament Entries',
    guestPasses: 'Guest Passes',
    coachingSessions: 'Coaching Sessions',
  };
  const [openCreateMembershipModal, setOpenCreateMembershipModal] =
    useState(false);
  const onCloseModal = () => setOpenCreateMembershipModal(false);

  if (isLoading || !user) return <p>Loading...</p>;

  return (
    <div>
      <Typography variant='h4' sx={{ color: 'text.primary' }}>
        {' '}
        Your Club Memberships
      </Typography>

      <div className='club-memberships-container'>
        {clubMembershipdata?.map((membership: any) => (
          <Card
            key={membership.id}
            className='membership-card'
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          >
            <CardContent>
              <Typography variant='h5'>{membership.membershipName}</Typography>
              <Typography variant='h6'>Price: ${membership.price}</Typography>
              <Typography variant='h6'>
                Duration: {membership.duration}
              </Typography>
              {membership.perks &&
                Object.values(membership.perks).some((v) => v !== 0) && (
                  <Box>
                    <Typography variant='h6' sx={{ mt: 1 }}>
                      Perks:
                    </Typography>
                    <ul style={{ paddingLeft: 5 }}>
                      {Object.entries(membership.perks)
                        .filter(([, value]) => value !== 0)
                        .map(([key, value]) => (
                          <li key={key}>
                            {perkLabels[key] ?? key}: {value}
                          </li>
                        ))}
                    </ul>
                  </Box>
                )}

              {membership.customPerks?.length > 0 && (
                <>
                  <ul style={{ paddingLeft: 16 }}>
                    {membership.customPerks.map((perk: any, index: number) => (
                      <li key={index}>
                        {perk.name}: {perk.value}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        <CreateClubmembershipModal
          open={openCreateMembershipModal}
          onClose={onCloseModal}
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
