import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers, useDeleteUser } from "../../api/userServiceApi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Drawer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./listUser.css";
import Loader from "../../../../shared/loader/Loader";
import { useViewportSize } from "../../../../shared/components/ViewportSize/useViewPortSize";
import { useHasPermission } from "../../../../context/UseHasPermission";
import { useUserInfo } from "../../../../context/UserInfoContext";
import CloseIcon from "@mui/icons-material/Close";
import CreateUser from "../create-user/createUser";

const ListUsers = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { userInfo } = useUserInfo();
  const userRole = userInfo.role;
  const hasPermission = useHasPermission(userRole);
  const canEditUsers = hasPermission("edit_users");
  const canDeleteUsers = hasPermission("delete_users");
  const {
    data: users,
    refetch,
    isLoading,
  } = useUsers(pageIndex, pageSize, debouncedSearch);
  const deleteUserMutation = useDeleteUser();
  const { width } = useViewportSize();
  const [drawerOpen, setDrawerOpen] = useState(false);


  const handleEditUser = (userId: string) => {
    navigate(`/update-user/${userId}`);
  };

  const handleDeleteUser = async (userId: unknown) => {
    try {
      await deleteUserMutation.mutateAsync(userId as string);
      refetch();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const updatedDate = (value: unknown) => {
    if (!value) return "N/A";
    const date = new Date(value as string);
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setDebouncedSearch("");
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setDebouncedSearch(search);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSearchIconClick = () => {
    setDebouncedSearch(search);
  };

  const noUsersFound = !isLoading && users && users?.users?.length === 0;

  if (isLoading) {
    return <Loader />;
  }

  const handleAddUser = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); 
  };

  return (
    <div className="list-user-container">
      <div className="users-heading-container">
        <h2 className="users-heading">Users</h2>
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </div>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        sx={{ marginBottom: "2rem" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

          <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
            <div className="user--drawer-container">
                  <div className="new-user-heading-container">
                    <div className="new-user-heading">New User</div>
                    <div>
                      <IconButton aria-label="close" onClick={handleCloseDrawer}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
              <CreateUser onClose={handleCloseDrawer}/>
            </div>
          </Drawer>

      {noUsersFound ? (
        <div className="no-users-found">
          <h3>No users found</h3>
        </div>
      ) : (
        <Paper>
          {width > 768 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="user table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "blue" }}>Username</TableCell>
                    <TableCell style={{ color: "blue" }}>Firstname</TableCell>
                    <TableCell style={{ color: "blue" }}>Lastname</TableCell>
                    <TableCell style={{ color: "blue" }}>Email</TableCell>
                    <TableCell style={{ color: "blue" }}>Role</TableCell>
                    <TableCell style={{ color: "blue" }}>Created At</TableCell>
                    <TableCell style={{ color: "blue" }}>Updated At</TableCell>
                    {canEditUsers && (
                      <TableCell style={{ color: "blue" }}>Edit</TableCell>
                    )}
                    {canDeleteUsers && (
                      <TableCell style={{ color: "blue" }}>Delete</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.users?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{updatedDate(user.createdAt)}</TableCell>
                      <TableCell>{updatedDate(user.updatedAt)}</TableCell>
                      {canEditUsers && (
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditUser(user._id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      )}
                      {canDeleteUsers && (
                        <TableCell>
                          <Popup
                            modal
                            trigger={
                              <IconButton color="secondary">
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            {(close: any) => (
                              <div className="popup-container">
                                <p>
                                  Are you sure you want to delete this user?
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteUser(user._id);
                                    close();
                                  }}
                                >
                                  Yes
                                </button>
                                <button type="button" onClick={close}>
                                  No
                                </button>
                              </div>
                            )}
                          </Popup>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="task-card-layout">
              <h3>User List</h3>
              {users?.users.map((user) => (
                <div key={user._id} className="card-container">
                  <div className="card-header">
                    User Name:<div className="card-data">{user.userName}</div>
                  </div>
                  <div className="card-header">
                    First Name:<div className="card-data">{user.firstName}</div>
                  </div>
                  <div className="card-header">
                    Last Name:<div className="card-data">{user.lastName} </div>
                  </div>
                  <div className="card-header">
                    User Email:<div className="card-data">{user.email}</div>
                  </div>
                  <div className="card-header">
                    User Role:<div className="card-data">{user.role}</div>
                  </div>
                  <div className="card-header">
                    User CreatedAt:
                    <div className="card-data">
                      {updatedDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="card-header">
                    User UpdatedAt:
                    <div className="card-data">
                      {updatedDate(user.updatedAt)}
                    </div>
                  </div>
                  <div className="card-actions">
                    <div className="card-action-header">
                      Actions:
                      <div className="card-data">
                        <IconButton
                          onClick={() => handleEditUser(user._id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <Popup
                          modal
                          trigger={
                            <IconButton color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          {(close: any) => (
                            <div className="popup-container">
                              <p>Are you sure you want to delete this user?</p>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteUser(user._id);
                                  close();
                                }}
                              >
                                Yes
                              </button>
                              <button type="button" onClick={close}>
                                No
                              </button>
                            </div>
                          )}
                        </Popup>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <TablePagination
            rowsPerPageOptions={[2, 5, 10, 15, 100]}
            component="div"
            count={users?.totalUsers || 0}
            rowsPerPage={pageSize}
            page={pageIndex}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
};

export default ListUsers;
