import { useGetmembershipsByClubId } from '../../shared/apis/memberships/useGetmembershipsByClubId';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import './CreateClubMembershipsPage.css';

const CreateClubMembershipsPage = () => {
  const navigate = useNavigate();
  const { data: clubMembershipdata, isLoading } = useGetmembershipsByClubId(
    '67e66d174ac81260061a2a8c'
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Your Club Memberships
      </h2>
      <div className='club-memberships-container'>
        {clubMembershipdata?.map((membership) => (
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

        {/* Add Membership Card */}
        <div
          className='add-membership-card'
          onClick={() => navigate('/addMembership')}
        >
          <AddIcon fontSize='inherit' />
        </div>
      </div>
    </div>
  );
};

export default CreateClubMembershipsPage;
