import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import { mealService } from '../../services/mealService';

const CreateMeal = ({ open, onClose, onSuccess, initialData = null }) => {
    // Default empty form
    const defaultForm = {
        mealType: '',
        menuItems: '',
        mealDate: new Date().toISOString().split('T')[0]
    };
    
    // State for form data
    const [mealData, setMealData] = useState(defaultForm);
    
    // State for error handling
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    
    // Reset form when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            if (initialData && initialData.id) {
                console.log("Edit mode - initialData:", initialData);
                // Make a deep copy to avoid reference issues
                setMealData({...initialData});
            } else {
                console.log("Create mode - using default form");
                setMealData({...defaultForm});
            }
        }
    }, [initialData, open]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMealData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Logging to debug the flow
            console.log("Form submitted");
            console.log("Is editing:", !!initialData?.id);
            console.log("Current meal data:", mealData);
            
            // Check which operation to perform
            if (initialData && initialData.id) {
                console.log(`Updating meal with ID: ${initialData.id}`);
                await mealService.updateMeal(initialData.id, mealData);
            } else {
                console.log("Creating new meal");
                await mealService.createMeal(mealData);
            }
            
            // On success, call the success callback and close the dialog
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save meal:', error);
            setError(error.message || 'An error occurred while saving the meal');
            setShowError(true);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {initialData && initialData.id ? 'Edit Meal' : 'Create Meal'}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Meal Type</InputLabel>
                            <Select
                                name="mealType"
                                value={mealData.mealType || ''}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="BREAKFAST">Breakfast</MenuItem>
                                <MenuItem value="LUNCH">Lunch</MenuItem>
                                <MenuItem value="DINNER">Dinner</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="menuItems"
                            label="Menu Items"
                            fullWidth
                            margin="normal"
                            value={mealData.menuItems || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            name="mealDate"
                            label="Meal Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={mealData.mealDate || ''}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {initialData && initialData.id ? 'Update' : 'Create'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Snackbar 
                open={showError} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
            >
                <Alert 
                    onClose={handleCloseError} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateMeal;