import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Box,
    IconButton,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import { messPlanService } from '../../services/messPlanService';

// Styled components
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3),
}));

const FormContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 0),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
    borderRadius: '8px',
    color: 'white',
    padding: '12px 24px',
    fontWeight: 'bold',
    '&:hover': {
        background: 'linear-gradient(45deg, #FF5722 50%, #FF9800 100%)',
    }
}));

const CreateMessPlan = ({ open, onClose, onSuccess, initialData = null }) => {
    const [planData, setPlanData] = useState({
        name: '',
        totalDays: '',
        price: ''
    });
    
    useEffect(() => {
        if (initialData) {
            setPlanData(initialData);
        } else {
            setPlanData({
                name: '',
                totalDays: '',
                price: ''
            });
        }
    }, [initialData, open]);

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

            if (initialData?.id) {
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
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url("/api/placeholder/500/500")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }
            }}
        >
            <StyledDialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RestaurantIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                        {initialData?.id ? 'Edit Mess Plan' : 'Create New Mess Plan'}
                    </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
                <FormContainer>
                    <form id="mess-plan-form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Plan Name"
                                    placeholder="E.g., Monthly Premium Plan"
                                    fullWidth
                                    variant="outlined"
                                    value={planData.name}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="totalDays"
                                    label="Total Days"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={planData.totalDays}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 1 }}
                                    helperText="Number of days in the plan"
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="price"
                                    label="Price (₹)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={planData.price}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                    helperText="Total price for the entire plan"
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </FormContainer>
            </DialogContent>
            
            <Divider />
            
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <SubmitButton 
                    type="submit" 
                    form="mess-plan-form"
                    variant="contained"
                >
                    {initialData?.id ? 'Update Plan' : 'Create Plan'}
                </SubmitButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMessPlan;