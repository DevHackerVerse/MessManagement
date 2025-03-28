import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel 
} from '@mui/material';
import { mealService } from '../../services/mealService';

const CreateMeal = ({ open, onClose, onSuccess, initialData = null }) => {
    const [mealData, setMealData] = useState(initialData || {
        mealType: '',
        menuItems: '',
        mealDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMealData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData) {
                await mealService.updateMeal(initialData.id, mealData);
            } else {
                await mealService.createMeal(mealData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create/update meal', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {initialData ? 'Edit Meal' : 'Create Meal'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Meal Type</InputLabel>
                        <Select
                            name="mealType"
                            value={mealData.mealType}
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
                        value={mealData.menuItems}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="mealDate"
                        label="Meal Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={mealData.mealDate}
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
                    >
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateMeal;