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

const tableCellStyle = {
  color: 'primary',
  fontWeight: 'bold',
};
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
  console.log(filteredUsers, 'filteredUsers');

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
          sx={{ fontWeight: 'bold', color: 'primary' }}
        >
          View Users List
        </Typography>
        <Button
          variant='contained'
          style={{ fontWeight: 'bold' }}
          onClick={handleOpenModal}
        >
          Add User
        </Button>
      </div>

      <TableContainer
        component={Paper}
        elevation={3}
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'primary',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell style={tableCellStyle}>Name</TableCell>
              <TableCell style={tableCellStyle}>Email</TableCell>
              <TableCell style={tableCellStyle}>Phone Number</TableCell>
              <TableCell style={tableCellStyle}>Role</TableCell>
              <TableCell style={tableCellStyle}>Tasks</TableCell>
              <TableCell style={tableCellStyle}>Address</TableCell>
              <TableCell style={tableCellStyle}>City</TableCell>
              <TableCell style={tableCellStyle}>Membership</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((userEntry: any, index: number) => (
              <TableRow key={index} sx={{ bgcolor: 'background.default' }}>
                <TableCell>{userEntry.user.name || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.email || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{userEntry.role?.name || 'N/A'}</TableCell>
                <TableCell>
                  {userEntry.user.tasks?.length > 0
                    ? userEntry.user.tasks.join(', ')
                    : 'No tasks'}
                </TableCell>
                <TableCell>{userEntry.user.address || 'N/A'}</TableCell>
                <TableCell>{userEntry.user.city || 'N/A'}</TableCell>
                <TableCell>
                  {userEntry.membershipPlan?.membershipName || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Viewusers;
