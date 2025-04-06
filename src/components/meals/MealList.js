import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    Chip,
    Container,
    Fade,
    Divider
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    RestaurantMenu as MenuIcon,
    Add as AddIcon 
} from '@mui/icons-material';
import { mealService } from '../../services/mealService';
import CreateMeal from './CreateMeal';

// Background styling constants
const bgStyle = {
    backgroundImage: 'url("https://th.bing.com/th/id/OIP.cKsBeY41IubTbvT9yz1MhAHaE8?rs=1&pid=ImgDetMain")', // Placeholder for a food-themed background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    padding: '40px 0',
    marginBottom: '30px',
    borderRadius: '8px',
    overflow: 'hidden',
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
};

const headerContentStyle = {
    position: 'relative',
    zIndex: 2,
    color: 'white',
    textAlign: 'center',
    padding: '20px',
};

// Inline ConfirmDialog component 
const ConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '10px',
                }
            }}
        >
            <DialogTitle id="confirm-dialog-title" sx={{ color: '#d32f2f' }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" variant="outlined">
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained" 
                    autoFocus
                    sx={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(211, 47, 47, 0.2)',
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Meal type chip color mapping
const mealTypeColors = {
    'BREAKFAST': '#ff9800', // Orange
    'LUNCH': '#2196f3',     // Blue
    'DINNER': '#673ab7'     // Purple
};

const MealList = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const data = await mealService.getAllMeals();
            setMeals(data);
        } catch (error) {
            console.error('Failed to fetch meals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const handleOpenCreateDialog = () => {
        setSelectedMeal(null);
        setIsEditing(false);
        setCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
        setSelectedMeal(null);
        setIsEditing(false);
    };

    const handleOpenEditDialog = (meal) => {
        console.log("Opening edit dialog with meal:", meal);
        // Make sure the meal has an id
        if (!meal || !meal.id) {
            console.error("Cannot edit meal without ID:", meal);
            return;
        }
        setSelectedMeal(meal);
        setIsEditing(true);
        setCreateDialogOpen(true);
    };

    const handleDeleteConfirm = (meal) => {
        setSelectedMeal(meal);
        setConfirmDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setConfirmDialogOpen(false);
        setSelectedMeal(null);
    };

    const handleDeleteMeal = async () => {
        try {
            if (selectedMeal && selectedMeal.id) {
                await mealService.deleteMeal(selectedMeal.id);
                fetchMeals();
                setConfirmDialogOpen(false);
                setSelectedMeal(null);
            } else {
                console.error("Cannot delete meal without ID");
            }
        } catch (error) {
            console.error('Failed to delete meal', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short', 
            day: 'numeric'
        });
    };

    return (
        <Container maxWidth="lg">
            {/* Attractive header with background */}
            <Box sx={bgStyle}>
                <Box sx={overlayStyle} />
                <Box sx={headerContentStyle}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Meal Planner
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Organize your meals and plan your nutrition
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                    <MenuIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Your Meals
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenCreateDialog}
                    startIcon={<AddIcon />}
                    sx={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(25, 118, 210, 0.2)',
                        padding: '10px 24px',
                    }}
                >
                    Add New Meal
                </Button>
            </Box>

            <Fade in={!loading} timeout={800}>
                <Box>
                    {loading ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography>Loading meals...</Typography>
                        </Paper>
                    ) : (
                        <TableContainer 
                            component={Paper} 
                            elevation={3}
                            sx={{ 
                                borderRadius: '12px',
                                overflow: 'hidden',
                                mb: 4,
                            }}
                        >
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Meal Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Menu Items</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {meals.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">No meals found</Typography>
                                                <Button 
                                                    variant="outlined" 
                                                    color="primary" 
                                                    onClick={handleOpenCreateDialog}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Create your first meal
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        meals.map((meal) => (
                                            <TableRow 
                                                key={meal.id}
                                                sx={{ 
                                                    '&:hover': { 
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                                                    },
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {formatDate(meal.mealDate)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={meal.mealType} 
                                                        sx={{ 
                                                            backgroundColor: mealTypeColors[meal.mealType] || '#9e9e9e',
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: '300px' }}>
                                                    <Typography 
                                                        variant="body2"
                                                        sx={{
                                                            lineHeight: 1.6,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        {meal.menuItems}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        onClick={() => handleOpenEditDialog(meal)}
                                                        color="primary"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        onClick={() => handleDeleteConfirm(meal)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Fade>

            <CreateMeal
                open={createDialogOpen}
                onClose={handleCloseCreateDialog}
                onSuccess={fetchMeals}
                initialData={isEditing ? selectedMeal : null}
            />

            <ConfirmDialog
                open={confirmDialogOpen}
                title="Delete Meal"
                content="Are you sure you want to delete this meal? This action cannot be undone."
                onConfirm={handleDeleteMeal}
                onCancel={handleDeleteCancel}
            />
            
            <Box sx={{ mt: 6, mb: 2, textAlign: 'center' }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Meal Planner App • Plan Your Nutrition
                </Typography>
            </Box>
        </Container>
    );
};

export default MealList;