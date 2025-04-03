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
    DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { mealService } from '../../services/mealService';
import CreateMeal from './CreateMeal';

// Inline ConfirmDialog component 
const ConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
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
        return date.toLocaleDateString();
    };

    return (
        <div>
            <Box sx={{ mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenCreateDialog}
                >
                    Create New Meal
                </Button>
            </Box>

            {loading ? (
                <p>Loading meals...</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Meal Type</TableCell>
                                <TableCell>Menu Items</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {meals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No meals found</TableCell>
                                </TableRow>
                            ) : (
                                meals.map((meal) => (
                                    <TableRow key={meal.id}>
                                        <TableCell>{formatDate(meal.mealDate)}</TableCell>
                                        <TableCell>{meal.mealType}</TableCell>
                                        <TableCell>{meal.menuItems}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenEditDialog(meal)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirm(meal)}>
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

            <CreateMeal
                open={createDialogOpen}
                onClose={handleCloseCreateDialog}
                onSuccess={fetchMeals}
                initialData={isEditing ? selectedMeal : null}
            />

            <ConfirmDialog
                open={confirmDialogOpen}
                title="Delete Meal"
                content="Are you sure you want to delete this meal?"
                onConfirm={handleDeleteMeal}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default MealList;