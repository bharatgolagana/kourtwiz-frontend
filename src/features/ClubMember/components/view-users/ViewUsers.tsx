import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';

const Viewusers = ({
  data,
  handleOpenModal,
}: {
  data: any;
  handleOpenModal: () => void;
}) => {
  if (!data) return <>Loading...</>;

  // Filter out users with the "Club Admin" role
  const filteredUsers = data.filter(
    (user: any) => user.role?.name !== 'ClubAdmin'
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography
          variant='h4'
          gutterBottom
          align='center'
          sx={{ fontWeight: 'bold', color: '#333', color: 'primary.main' }}
        >
          View Users List
        </Typography>
        <Button
          variant='contained'
          color='primary'
          style={{ fontWeight: 'bold' }}
          onClick={handleOpenModal}
        >
          Add User
        </Button>
      </div>

      <TableContainer
        component={Paper}
        elevation={3}
        style={{ borderRadius: '10px', overflow: 'hidden' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Phone Number
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Role
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Tasks
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                Address
              </TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                City
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((userEntry: any, index: number) => (
              <TableRow key={index} sx={{ bgcolor: 'background.default' }}>
                <TableCell>{userEntry.user.name || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.email || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.role?.name || 'N/A'}</TableCell>
                <TableCell>
                  {userEntry.user.tasks?.length > 0
                    ? userEntry.user.tasks.join(', ')
                    : 'No tasks'}
                </TableCell>
                <TableCell>{userEntry.user.address || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.city || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Viewusers;
