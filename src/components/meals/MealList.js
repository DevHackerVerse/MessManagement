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
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel 
} from '@mui/material';
import { mealService } from '../../services/mealService';

const MealList = () => {
    const [meals, setMeals] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const mealData = await mealService.getAllMeals();
            setMeals(mealData);
        } catch (error) {
            console.error('Failed to fetch meals', error);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await mealService.deleteMeal(mealId);
            fetchMeals();
        } catch (error) {
            console.error('Failed to delete meal', error);
        }
    };

    const handleOpenEditDialog = (meal) => {
        setSelectedMeal(meal);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMeal(null);
    };

    const handleUpdateMeal = async () => {
        try {
            await mealService.updateMeal(selectedMeal.id, selectedMeal);
            fetchMeals();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to update meal', error);
        }
    };

    return (
        <div>
            <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                    setSelectedMeal({
                        mealType: '',
                        menuItems: '',
                        mealDate: new Date().toISOString().split('T')[0]
                    });
                    setOpenDialog(true);
                }}
            >
                Create New Meal
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Meal Type</TableCell>
                            <TableCell>Menu Items</TableCell>
                            <TableCell>Meal Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {meals.map((meal) => (
                            <TableRow key={meal.id}>
                                <TableCell>{meal.id}</TableCell>
                                <TableCell>{meal.mealType}</TableCell>
                                <TableCell>{meal.menuItems}</TableCell>
                                <TableCell>{meal.mealDate}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleOpenEditDialog(meal)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDeleteMeal(meal.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Meal Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedMeal?.id ? 'Edit Meal' : 'Create New Meal'}
                </DialogTitle>
                <DialogContent>
                    {selectedMeal && (
                        <>
                            <FormControl fullWidth>
                                <InputLabel>Meal Type</InputLabel>
                                <Select
                                    value={selectedMeal.mealType}
                                    label="Meal Type"
                                    onChange={(e) => setSelectedMeal({
                                        ...selectedMeal, 
                                        mealType: e.target.value
                                    })}
                                >
                                    <MenuItem value="BREAKFAST">Breakfast</MenuItem>
                                    <MenuItem value="LUNCH">Lunch</MenuItem>
                                    <MenuItem value="DINNER">Dinner</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Menu Items"
                                fullWidth
                                value={selectedMeal.menuItems}
                                onChange={(e) => setSelectedMeal({
                                    ...selectedMeal, 
                                    menuItems: e.target.value
                                })}
                            />
                            <TextField
                                label="Meal Date"
                                type="date"
                                fullWidth
                                value={selectedMeal.mealDate}
                                onChange={(e) => setSelectedMeal({
                                    ...selectedMeal, 
                                    mealDate: e.target.value
                                })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleUpdateMeal}
                            >
                                {selectedMeal.id ? 'Update' : 'Create'}
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MealList;