import React from 'react';
import { Box } from '@mui/material';
import UserDetails from '../../features/UserManagmentGetUpdate/UserDetails';

const UserManagmentGetUpdate: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', padding: 3 }}>
      <UserDetails />
    </Box>
  );
};

export default UserManagmentGetUpdate;
