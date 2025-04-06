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
    InputLabel,
    Box,
    Container,
    Avatar,
    IconButton,
    Tooltip,
    DialogActions,
    alpha,
    Grid,
    Chip,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Restaurant as RestaurantIcon, CalendarMonth as CalendarIcon, Email as EmailIcon } from '@mui/icons-material';
import { userService } from '../../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userMessPlan, setUserMessPlan] = useState(null);
    const [openMessPlanDialog, setOpenMessPlanDialog] = useState(false);

    // Background style
    const backgroundStyle = {
        backgroundImage: 'url("https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1615&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem'
    };

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

    const handleViewMessPlan = async (user) => {
        try {
            const messPlan = await userService.getUserMessPlan(user.id);
            setSelectedUser(user);
            setUserMessPlan(messPlan);
            setOpenMessPlanDialog(true);
        } catch (error) {
            console.error('Failed to fetch user mess plan', error);
        }
    };

    // Function to generate avatar background color based on name
    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    };

    // Get initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const renderMessPlanDetails = () => {
        if (!userMessPlan) return <Typography>No Mess Plan Found</Typography>;

        return (
            <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: stringToColor(selectedUser?.name || ''),
                                        mr: 2,
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    {getInitials(selectedUser?.name || '')}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{selectedUser?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                        {selectedUser?.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider>
                                <Chip 
                                    icon={<RestaurantIcon />} 
                                    label="Mess Plan Details" 
                                    color="primary" 
                                />
                            </Divider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                p: 2, 
                                backgroundColor: 'primary.light', 
                                color: 'primary.contrastText',
                                borderRadius: 2
                            }}>
                                <Typography variant="h6">{userMessPlan.messPlan.name}</Typography>
                                <Typography variant="body2">{userMessPlan.messPlan.totalDays} Total Days</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Box sx={{ 
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '6px solid',
                                    borderColor: 'secondary.main',
                                    bgcolor: 'background.paper'
                                }}>
                                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                                        {userMessPlan.remainingDays}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        days left
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarIcon sx={{ color: 'primary.main', mr: 1 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Start Date</Typography>
                                            <Typography variant="body1">{new Date(userMessPlan.startDate).toLocaleDateString()}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarIcon sx={{ color: 'error.main', mr: 1 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
                                            <Typography variant="body1">{new Date(userMessPlan.expiryDate).toLocaleDateString()}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        mt: 2, 
                                        p: 2, 
                                        bgcolor: 'info.light', 
                                        color: 'info.contrastText',
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="body2">
                                            Skip Days Used: <strong>{userMessPlan.skipDaysUsed}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={backgroundStyle}>
            <Container maxWidth="lg">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: alpha('#ffffff', 0.9),
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            User Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            color="primary"
                            sx={{ borderRadius: 2 }}
                        >
                            Add New User
                        </Button>
                    </Box>
                    
                    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: theme => theme.palette.primary.main }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow 
                                        key={user.id}
                                        sx={{ 
                                            '&:hover': { 
                                                backgroundColor: theme => theme.palette.action.hover 
                                            } 
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: stringToColor(user.name),
                                                        mr: 2
                                                    }}
                                                >
                                                    {getInitials(user.name)}
                                                </Avatar>
                                                <Typography variant="body1">{user.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Box 
                                                component="span"
                                                sx={{
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: user.role === 'ADMIN' ? 'rgba(255, 86, 48, 0.16)' : 'rgba(24, 144, 255, 0.16)',
                                                    color: user.role === 'ADMIN' ? 'rgb(183, 33, 54)' : 'rgb(24, 144, 255)'
                                                }}
                                            >
                                                {user.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit User">
                                                <IconButton 
                                                    onClick={() => handleOpenEditDialog(user)}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete User">
                                                <IconButton 
                                                    onClick={() => handleDelete(user.id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View Mess Plan">
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<RestaurantIcon />}
                                                    onClick={() => handleViewMessPlan(user)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Mess Plan
                                                </Button>
                                            </Tooltip>
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
                        PaperProps={{
                            elevation: 24,
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle sx={{ pb: 1 }}>
                            <Typography variant="h5" fontWeight="bold">Edit User</Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            {selectedUser && (
                                <Box sx={{ minWidth: 400, pt: 1 }}>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={selectedUser.name}
                                        onChange={(e) => setSelectedUser({
                                            ...selectedUser, 
                                            name: e.target.value
                                        })}
                                        margin="normal"
                                        variant="outlined"
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
                                        variant="outlined"
                                    />
                                    <FormControl fullWidth margin="normal" variant="outlined">
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={selectedUser.role}
                                            onChange={(e) => setSelectedUser({
                                                ...selectedUser, 
                                                role: e.target.value
                                            })}
                                            label="Role"
                                        >
                                            <MenuItem value="USER">User</MenuItem>
                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button 
                                onClick={() => setOpenDialog(false)}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleUpdateUser}
                                sx={{ ml: 1 }}
                            >
                                Update User
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Mess Plan Dialog */}
                    <Dialog 
                        open={openMessPlanDialog} 
                        onClose={() => setOpenMessPlanDialog(false)}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            elevation: 24,
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <RestaurantIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Mess Plan for {selectedUser?.name}</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3 }}>
                            {renderMessPlanDetails()}
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpenMessPlanDialog(false)}
                                color="secondary"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Container>
        </Box>
    );
};

export default UserManagement;