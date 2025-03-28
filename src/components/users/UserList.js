import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField, 
    Typography, 
    Grid 
} from '@mui/material';
import { userService } from '../../services/userService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userMessPlan, setUserMessPlan] = useState(null); // FIX: Define state for userMessPlan
    const [openMessPlanDialog, setOpenMessPlanDialog] = useState(false); // FIX: Define state for Mess Plan dialog

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userData = await userService.getAllUsers();
            setUsers(userData);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const handleOpenEditDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = async () => {
        try {
            await userService.updateUser(selectedUser.id, selectedUser);
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    const handleViewMessPlan = async (user) => {
        try {
            const messPlan = await userService.getUserMessPlan(user.id);
            setSelectedUser(user);
            setUserMessPlan(messPlan); // FIX: Set mess plan details in state
            setOpenMessPlanDialog(true); // FIX: Open mess plan dialog
        } catch (error) {
            console.error('Failed to fetch user mess plan', error);
        }
    };

    const renderMessPlanDetails = () => {
        if (!userMessPlan) return <Typography>No Mess Plan Found</Typography>;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Mess Plan Details</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Plan Name: {userMessPlan.messPlan.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Total Days: {userMessPlan.messPlan.totalDays}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Remaining Days: {userMessPlan.remainingDays}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Start Date: {new Date(userMessPlan.startDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Expiry Date: {new Date(userMessPlan.expiryDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Skip Days Used: {userMessPlan.skipDaysUsed}</Typography>
                </Grid>
            </Grid>
        );
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleOpenEditDialog(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleViewMessPlan(user)}
                                    >
                                        View Mess Plan
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <TextField
                                label="Name"
                                fullWidth
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser, 
                                    name: e.target.value
                                })}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser, 
                                    email: e.target.value
                                })}
                            />
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleUpdateUser}
                            >
                                Update
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Mess Plan Dialog */}
            <Dialog 
                open={openMessPlanDialog} 
                onClose={() => setOpenMessPlanDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Mess Plan for {selectedUser?.name}
                </DialogTitle>
                <DialogContent>
                    {renderMessPlanDetails()}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserList;
