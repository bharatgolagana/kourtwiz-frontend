import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ClubLandingPage.css';

const ClubLandingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const clubName = location.state?.clubName || 'Unknown Club';
  const membershipTypes = location.state?.membershipTypes || [];
  const bgColor = location.state?.bgColor || '#f5f5f5';
  const clubImage = location.state?.clubImage || '';
  const description = location.state?.description || 'Welcome to our club!';

  const handleSelectPlan = (membershipId) => {
    navigate('/member-registration/signup', {
      state: {
        clubId: id,
        membershipId,
      },
    });
  };

  return (
    <>
      <div className='button-group'>
        <p>{clubName}</p>
        <button className='btn' onClick={() => navigate('/home')}>Login</button>

        <button
          className='btn'
          onClick={() => navigate(`/clubs/${id}/authentication`, { state: { clubName } })}
        >
          Authenticate
        </button>
      </div>

      <div className='club-landing' style={{ backgroundColor: bgColor }}>
        <div className='club-container' style={{ backgroundImage: clubImage ? `url(${clubImage})` : 'none' }}>
          <h1>Welcome to {clubName}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className='membership-types'>
        <h2>Choose a Membership Plan</h2>
        <div className='membership-cards'>
          {membershipTypes.map((type) => (
            <div key={type.id} className='membership-card'>
              <h3>{type.name}</h3>
              <p>{type.description}</p>
              <p>Price: ${type.price}</p>
              <button className='btn' onClick={() => handleSelectPlan(type.id)}>Select Plan</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClubLandingPage;
