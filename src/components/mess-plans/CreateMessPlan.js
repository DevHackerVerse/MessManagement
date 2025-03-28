import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent 
} from '@mui/material';
import { messPlanService } from '../../services/messPlanService';

const CreateMessPlan = ({ open, onClose, onSuccess, initialData = null }) => {
    const [planData, setPlanData] = useState(initialData || {
        name: '',
        totalDays: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlanData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...planData,
                totalDays: parseInt(planData.totalDays),
                price: parseFloat(planData.price)
            };

            if (initialData) {
                await messPlanService.updateMessPlan(initialData.id, formattedData);
            } else {
                await messPlanService.createMessPlan(formattedData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create/update mess plan', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {initialData ? 'Edit Mess Plan' : 'Create Mess Plan'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label="Plan Name"
                        fullWidth
                        margin="normal"
                        value={planData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="totalDays"
                        label="Total Days"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={planData.totalDays}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 1 }}
                    />
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={planData.price}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
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

export default CreateMessPlan;