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
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel 
} from '@mui/material';
import { userService } from '../../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleDelete = async (userId) => {
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

    const handleUpdateUser = async () => {
        try {
            await userService.updateUser(selectedUser.id, selectedUser);
            fetchUsers();
            setOpenDialog(false);
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleOpenEditDialog(user)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit User Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
            >
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
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser, 
                                    email: e.target.value
                                })}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser, 
                                        role: e.target.value
                                    })}
                                >
                                    <MenuItem value="USER">User</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleUpdateUser}
                                fullWidth
                            >
                                Update User
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;