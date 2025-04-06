import React, { useState, Dispatch, SetStateAction } from 'react';
import { AppBar, Toolbar as MuiToolbar, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useKeycloak } from '@react-keycloak/web';
import { useUserInfo } from '../../context/UserInfoContext';
import { useNavigate } from 'react-router-dom';
import './Toolbar.css';
import { useViewportSize } from '../../shared/components/ViewportSize/useViewPortSize';
import UserProfile from '../userProfile/components/user-profile/UserProfile';

type Props = {
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  handleMenu: () => void;
};

const Toolbar: React.FC<Props> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleMenu,
}) => {
  const { width } = useViewportSize();

  const toolbarAction = () => {
    handleMenu();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='toolbar-header'>
      <AppBar className='toolbar'>
        <MuiToolbar className='toolbar__content'>
          <p style={{ color: 'black' }}>Welcome to Kourtwiz</p>
          {width < 769 && (
            <div className='toolbar___logo__container'>
              {/* <img src={LGLogoMini} /> */}
            </div>
          )}
          {width < 600 && (
            <Box
              className={
                width < 600
                  ? 'cnr-search-container__hidden'
                  : 'cnr-search-container'
              }
            >
              <p>Welcome to Kourtwiz</p>
            </Box>
          )}

          <Box className='toolbar__buttons'>
            <div>
              <Button className='user-profile-container'>
                <UserProfile />
              </Button>
            </div>
            <div
              className={`${width > 768 ? 'hamburger__btn__visible' : ''}`}
              onClick={toolbarAction}
            >
              <MenuIcon />
            </div>
          </Box>
        </MuiToolbar>
      </AppBar>
    </div>
  );
};

export default Toolbar;
