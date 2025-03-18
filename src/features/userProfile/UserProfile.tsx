import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserInfoContext } from '../../context/UserInfoContext';
import './UserProfile.css';
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Slide } from '@mui/material';
// import { useKeycloak } from "@react-keycloak/web";
import Logout from '../../assets/Vector.svg';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { userInfo } = useContext(UserInfoContext) || {};
  const [userDisplay, setUserDisplay] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  // const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const userDetails = () => {
    setUserDisplay((prev) => !prev);
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // keycloak.login();
  };

  const handleLogout = () => {
    // keycloak.logout({
    //   redirectUri: window.location.origin,
    // });
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('availability');
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setUserDisplay(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='user-profile-main-container'>
      <div ref={ref} className='user-profile-container' onClick={userDetails}>
        <Avatar
          className='user-profile__avatar'
          src={userInfo?.profile?.profileImages?.[0] || undefined}
        >
          {!userInfo?.profile?.profileImages?.[0] &&
            userInfo?.userName?.charAt(0).toUpperCase()}
          {'A '}
        </Avatar>
        <ExpandMoreIcon
          className={`expand-icon ${userDisplay ? 'rotate' : ''}`}
        />
      </div>

      <Slide direction='left' in={userDisplay} mountOnEnter unmountOnExit>
        <div ref={ref} className='user-profile-details'>
          <div className='user-profile__name'>
            {userInfo?.firstName} {userInfo?.lastName}
          </div>
          <div className='user-profile__email'>{userInfo?.email}</div>
          <hr className='user-profile__hr'></hr>
          <hr className='user-profile__hr'></hr>
          <div className='user__profile__logout__container'>
            <Button onClick={openLogoutDialog} className='logout-btn'>
              Logout
              <img src={Logout} />
            </Button>

            <div
              onClick={() => setUserDisplay(false)}
              className='profile__close-icon'
            >
              <CloseIcon />
            </div>
          </div>
        </div>
      </Slide>
      <div className='profile-logout-dialog-container'>
        <Dialog
          open={logoutDialogOpen}
          onClose={closeLogoutDialog}
          classes={{ paper: 'logout-dialog-paper' }}
        >
          <DialogTitle className='logout-dialog-title'>
            Do you want to Logout?
          </DialogTitle>
          <DialogContent className='logout-dialog-content'>
            Logging out will end your session and you will need to sign in again
            to access your profile.
          </DialogContent>
          <DialogActions className='logout-dialog-actions'>
            <Button
              onClick={closeLogoutDialog}
              className='logout-dialog-cancel-btn'
            >
              Cancel
            </Button>
            <Button
              variant='outlined'
              onClick={handleLogout}
              className='logout-dialog-logout-btn'
              autoFocus
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
