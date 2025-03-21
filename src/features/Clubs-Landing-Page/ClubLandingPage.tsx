import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ClubLandingPage.css';
import pickleball1 from '../../assets/pickleball1.jpg';
import pickleball3 from '../../assets/69c276be-7548-473e-8ec7-24db9c135a35.jpeg';
import pickleball4 from '../../assets/b357939a-e94c-4619-a970-08eb5c85570c.jpeg';

const clubs = [
  {
    id: '67d261f783c50d6c7df9dd50',
    name: 'New Jersey Club',
    description: 'Premium coaching and top-tier facilities.',
    image: pickleball1,
    bgColor: '#ffcccb',
  },
  {
    id: '67d2620383c50d6c7df9dd51',
    name: 'Houston Club',
    description: 'A great place for community play and tournaments.',
    image: pickleball3,
    bgColor: '#d1e7dd',
  },
  {
    id: '67d2cc08c1534675fa24ff39',
    name: 'Manchester-pickball',
    description: 'Train like a pro with experienced instructors.',
    image: pickleball4,
    bgColor: '#cce5ff',
  },
];
const ClubLandingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const clubName = location.state?.clubName || 'Unknown Club';
  const navigate = useNavigate();

  const club = clubs.find((club) => club.id === id);
  const bgColor = club?.bgColor || '#ffffff';
  const description = club?.description || 'No description available';
  const clubImage = club?.image || { clubName };

  return (
    <>
      <div className='button-group'>
        <p>{clubName}</p>
        <button className='btn' onClick={() => navigate('/home')}>
          Login
        </button>
        <button
          className='btn'
          onClick={() =>
            navigate('/member-registration/signup', {
              state: {
                clubId: id,
                clubName: clubName,
              },
            })
          }
        >
          Become a Member
        </button>
        <button
          className='btn'
          onClick={() =>
            navigate(`/clubs/${id}/authentication`, { state: { clubName } })
          }
        >
          Authenticate
        </button>
      </div>
      <div className='club-landing' style={{ backgroundColor: bgColor }}>
        <div
          className='club-container'
          style={{ backgroundImage: clubImage ? `url(${clubImage})` : 'none' }}
        >
          <h1>Welcome to {clubName}</h1>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export default ClubLandingPage;
