import React, { useState, useEffect } from 'react';
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
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField,
    Box,
    Container,
    Card,
    CardContent,
    Grid,
    Fade,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { messPlanService } from '../../services/messPlanService';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url("https://png.pngtree.com/thumb_back/fw800/background/20240126/pngtree-restaurant-blur-images-dark-background-image_15612197.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    borderRadius: '16px',
    overflow: 'hidden',
}));

const CardHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
    padding: theme.spacing(3),
    color: 'white',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(3),
    boxShadow: 'none',
    borderRadius: '8px',
    overflow: 'hidden',
    '& .MuiTableHead-root': {
        backgroundColor: '#f5f5f5',
    },
    '& .MuiTableRow-root': {
        '&:nth-of-type(even)': {
            backgroundColor: '#fafafa',
        },
        '&:hover': {
            backgroundColor: '#f1f1f1',
        }
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: 'none',
    padding: '8px 16px',
}));

const MessPlanManagement = () => {
    const [messPlans, setMessPlans] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMessPlans();
    }, []);

    const fetchMessPlans = async () => {
        setLoading(true);
        try {
            const plans = await messPlanService.getAllMessPlans();
            console.log('Fetched Mess Plans:', plans);
            setMessPlans(plans);
        } catch (error) {
            console.error('Failed to fetch mess plans', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdatePlan = async () => {
        try {
            if (selectedPlan.id) {
                await messPlanService.updateMessPlan(selectedPlan.id, selectedPlan);
            } else {
                await messPlanService.createMessPlan(selectedPlan);
            }
            fetchMessPlans();
            setOpenDialog(false);
        } catch (error) {
            console.error('Failed to create/update mess plan', error);
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            await messPlanService.deleteMessPlan(planId);
            fetchMessPlans();
        } catch (error) {
            console.error('Failed to delete mess plan', error);
        }
    };

    const openCreateDialog = () => {
        setSelectedPlan({
            name: '',
            totalDays: 0,
            price: 0
        });
        setOpenDialog(true);
    };

    const openEditDialog = (plan) => {
        setSelectedPlan({...plan});
        setOpenDialog(true);
    };

    return (
        <Fade in={true} timeout={800}>
            <PageWrapper>
                <Container maxWidth="lg">
                    <StyledCard>
                        <CardHeader>
                            <Typography variant="h4" fontWeight="bold">
                                Mess Plan Management
                            </Typography>
                        </CardHeader>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Manage your meal plans with ease
                                </Typography>
                                <ActionButton 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={openCreateDialog}
                                    startIcon={<AddIcon />}
                                >
                                    Create New Plan
                                </ActionButton>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : messPlans.length === 0 ? (
                                <Box sx={{ 
                                    p: 4, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    backgroundColor: '#f9f9f9', 
                                    borderRadius: 2 
                                }}>
                                    <img 
                                        src="/api/placeholder/200/200" 
                                        alt="No plans" 
                                        style={{ opacity: 0.6, marginBottom: 16 }} 
                                    />
                                    <Typography variant="h6" color="text.secondary">
                                        No mess plans found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Create your first meal plan to get started
                                    </Typography>
                                </Box>
                            ) : (
                                <StyledTableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Total Days</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {messPlans.map((plan) => (
                                                <TableRow key={plan.id}>
                                                    <TableCell>{plan.id}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">
                                                            {plan.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{plan.totalDays}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'success.main' }}>
                                                            ₹{plan.price.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                            <ActionButton 
                                                                variant="outlined" 
                                                                color="primary"
                                                                onClick={() => openEditDialog(plan)}
                                                                startIcon={<EditIcon />}
                                                                size="small"
                                                            >
                                                                Edit
                                                            </ActionButton>
                                                            <ActionButton 
                                                                variant="outlined" 
                                                                color="error"
                                                                onClick={() => handleDeletePlan(plan.id)}
                                                                startIcon={<DeleteIcon />}
                                                                size="small"
                                                            >
                                                                Delete
                                                            </ActionButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </StyledTableContainer>
                            )}

                            {/* Create/Edit Dialog */}
                            <Dialog 
                                open={openDialog} 
                                onClose={() => setOpenDialog(false)}
                                maxWidth="sm"
                                fullWidth
                                PaperProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            >
                                <DialogTitle sx={{ 
                                    background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
                                    color: 'white',
                                    py: 2
                                }}>
                                    {selectedPlan?.id ? 'Edit Mess Plan' : 'Create Mess Plan'}
                                </DialogTitle>
                                <DialogContent sx={{ p: 3, pt: 3 }}>
                                    {selectedPlan && (
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Plan Name"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={selectedPlan.name}
                                                    onChange={(e) => setSelectedPlan({
                                                        ...selectedPlan, 
                                                        name: e.target.value
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="Total Days"
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={selectedPlan.totalDays}
                                                    onChange={(e) => setSelectedPlan({
                                                        ...selectedPlan, 
                                                        totalDays: parseInt(e.target.value)
                                                    })}
                                                    inputProps={{ min: 1 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="Price (₹)"
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={selectedPlan.price}
                                                    onChange={(e) => setSelectedPlan({
                                                        ...selectedPlan, 
                                                        price: parseFloat(e.target.value)
                                                    })}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2 }}>
                                                <ActionButton 
                                                    variant="contained" 
                                                    color="primary"
                                                    onClick={handleCreateOrUpdatePlan}
                                                    fullWidth
                                                    size="large"
                                                >
                                                    {selectedPlan.id ? 'Update Plan' : 'Create Plan'}
                                                </ActionButton>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </StyledCard>
                </Container>
            </PageWrapper>
        </Fade>
    );
};

export default MessPlanManagement;