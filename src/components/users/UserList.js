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
    DialogActions,
    TextField, 
    Typography, 
    Grid,
    Box,
    Container,
    Avatar,
    IconButton,
    Tooltip,
    Chip,
    Divider,
    Card,
    CardContent,
    alpha
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Restaurant as RestaurantIcon,
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { userService } from '../../services/userService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userMessPlan, setUserMessPlan] = useState(null);
    const [openMessPlanDialog, setOpenMessPlanDialog] = useState(false);
    
    // Background style with image
    const backgroundStyle = {
        backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/21/40/16/360_F_221401603_6urJw6Di9KjlgcPgLfkdVLHtc5Q21aCx.jpg")',
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
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: alpha('#ffffff', 0.9),
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'top' }} />
                        User List
                    </Typography>
                    
                    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: theme => theme.palette.primary.main }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
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
                                        sx={{ '&:hover': { backgroundColor: theme => theme.palette.action.hover } }}
                                    >
                                        <TableCell>{user.id}</TableCell>
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
                                            <Chip 
                                                label={user.role} 
                                                color={user.role === 'ADMIN' ? 'error' : 'primary'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Edit User">
                                                    <IconButton 
                                                        onClick={() => handleOpenEditDialog(user)}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete User">
                                                    <IconButton 
                                                        onClick={() => handleDeleteUser(user.id)}
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Edit User Dialog */}
                    <Dialog 
                        open={openDialog} 
                        onClose={handleCloseDialog}
                        PaperProps={{
                            elevation: 24,
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EditIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Edit User</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, minWidth: 400 }}>
                            {selectedUser && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Name"
                                            fullWidth
                                            value={selectedUser.name}
                                            onChange={(e) => setSelectedUser({
                                                ...selectedUser, 
                                                name: e.target.value
                                            })}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            value={selectedUser.email}
                                            onChange={(e) => setSelectedUser({
                                                ...selectedUser, 
                                                email: e.target.value
                                            })}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Button 
                                variant="outlined"
                                onClick={handleCloseDialog}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleUpdateUser}
                                startIcon={<EditIcon />}
                            >
                                Update
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

export default UserList;