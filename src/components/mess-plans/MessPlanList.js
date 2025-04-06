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
    Box,
    Container,
    Card,
    CardContent,
    Grid,
    Fade,
    Chip,
    Avatar,
    CircularProgress,
    Tooltip,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Restaurant as RestaurantIcon,
    CalendarMonth as CalendarIcon,
    AttachMoney as MoneyIcon,
    GridView as GridViewIcon,
    ViewList as ViewListIcon
} from '@mui/icons-material';
import { messPlanService } from '../../services/messPlanService';
import CreateMessPlan from './CreateMessPlan';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url("/api/placeholder/1920/1080")',
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

const PlanCard = styled(Card)(({ theme }) => ({
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    }
}));

const CardHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
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

const EmptyStateContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6), 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    backgroundColor: '#f9f9f9', 
    borderRadius: 16,
    textAlign: 'center'
}));

const MessPlanList = () => {
    const [messPlans, setMessPlans] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    useEffect(() => {
        fetchMessPlans();
    }, []);

    const fetchMessPlans = async () => {
        setLoading(true);
        try {
            const plans = await messPlanService.getAllMessPlans();
            setMessPlans(plans);
        } catch (error) {
            console.error('Failed to fetch mess plans', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (planId) => {
        try {
            await messPlanService.deleteMessPlan(planId);
            fetchMessPlans();
        } catch (error) {
            console.error('Failed to delete mess plan', error);
        }
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setOpenDialog(true);
    };

    // Generate a color based on the plan name
    const getPlanColor = (planName) => {
        const colors = ['#3f51b5', '#f44336', '#009688', '#ff9800', '#673ab7', '#2196f3'];
        const hash = planName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    const renderGridView = () => (
        <Grid container spacing={3}>
            {messPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                    <PlanCard>
                        <Box sx={{ 
                            height: 8, 
                            backgroundColor: getPlanColor(plan.name) 
                        }} />
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" gutterBottom>
                                    {plan.name}
                                </Typography>
                                <Chip 
                                    label={`₹${plan.price.toFixed(2)}`}
                                    color="primary"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        background: getPlanColor(plan.name)
                                    }}
                                />
                            </Box>
                            
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {plan.totalDays} days
                                </Typography>
                            </Box>
                            
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <MoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    ₹{(plan.price / plan.totalDays).toFixed(2)} per day
                                </Typography>
                            </Box>
                            
                            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                                <Button 
                                    variant="outlined" 
                                    color="primary"
                                    onClick={() => handleEdit(plan)}
                                    startIcon={<EditIcon />}
                                    fullWidth
                                    size="small"
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => handleDelete(plan.id)}
                                    startIcon={<DeleteIcon />}
                                    fullWidth
                                    size="small"
                                >
                                    Delete
                                </Button>
                            </Box>
                        </CardContent>
                    </PlanCard>
                </Grid>
            ))}
        </Grid>
    );

    const renderTableView = () => (
        <StyledTableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Total Days</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messPlans.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 32, 
                                            height: 32, 
                                            mr: 1.5, 
                                            bgcolor: getPlanColor(plan.name) 
                                        }}
                                    >
                                        <RestaurantIcon fontSize="small" />
                                    </Avatar>
                                    <Typography variant="subtitle2">
                                        {plan.name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{plan.totalDays} days</TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: 'success.main' }}>
                                    ₹{plan.price.toFixed(2)}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Button 
                                        variant="outlined" 
                                        color="primary"
                                        onClick={() => handleEdit(plan)}
                                        startIcon={<EditIcon />}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => handleDelete(plan.id)}
                                        startIcon={<DeleteIcon />}
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );

    const renderEmptyState = () => (
        <EmptyStateContainer>
            <img 
                src="/api/placeholder/200/200" 
                alt="No plans" 
                style={{ opacity: 0.6, marginBottom: 16 }} 
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                No Mess Plans Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                Create your first meal plan to start managing your mess services and provide meal options for your users.
            </Typography>
            <ActionButton 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setSelectedPlan(null);
                    setOpenDialog(true);
                }}
                startIcon={<AddIcon />}
                size="large"
            >
                Create Your First Plan
            </ActionButton>
        </EmptyStateContainer>
    );

    return (
        <Fade in={true} timeout={800}>
            <PageWrapper>
                <Container maxWidth="lg">
                    <StyledCard>
                        <CardHeader>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <RestaurantIcon sx={{ mr: 1.5, fontSize: 28 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        Mess Plans
                                    </Typography>
                                </Box>
                                <ActionButton 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={() => {
                                        setSelectedPlan(null);
                                        setOpenDialog(true);
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    Create New Plan
                                </ActionButton>
                            </Box>
                        </CardHeader>
                        
                        <CardContent sx={{ p: 3 }}>
                            {messPlans.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {messPlans.length} {messPlans.length === 1 ? 'plan' : 'plans'} available
                                    </Typography>
                                    <Box>
                                        <Tooltip title="Grid View">
                                            <IconButton 
                                                color={viewMode === 'grid' ? 'primary' : 'default'} 
                                                onClick={() => setViewMode('grid')}
                                            >
                                                <GridViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Table View">
                                            <IconButton 
                                                color={viewMode === 'table' ? 'primary' : 'default'} 
                                                onClick={() => setViewMode('table')}
                                            >
                                                <ViewListIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            )}

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : messPlans.length === 0 ? (
                                renderEmptyState()
                            ) : (
                                viewMode === 'grid' ? renderGridView() : renderTableView()
                            )}
                        </CardContent>
                    </StyledCard>
                </Container>
            </PageWrapper>
            
            {openDialog && (
                <CreateMessPlan
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSuccess={fetchMessPlans}
                    initialData={selectedPlan}
                />
            )}
        </Fade>
    );
};

export default MessPlanList;