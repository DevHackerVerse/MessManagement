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
    Alert,
    Grid,
    Typography,
    IconButton,
    Box,
    Slide,
    FormHelperText,
    InputAdornment
} from '@mui/material';
import { 
    Close as CloseIcon, 
    BreakfastDining as BreakfastIcon,
    LunchDining as LunchIcon,
    DinnerDining as DinnerIcon,
    Today as TodayIcon,
    Notes as NotesIcon
} from '@mui/icons-material';
import { mealService } from '../../services/mealService';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
    
    // State for form validation
    const [formErrors, setFormErrors] = useState({
        mealType: false,
        menuItems: false,
        mealDate: false
    });
    
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
            // Reset form errors
            setFormErrors({
                mealType: false,
                menuItems: false,
                mealDate: false
            });
        }
    }, [initialData, open]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMealData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear the error for this field as user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const validateForm = () => {
        const errors = {
            mealType: !mealData.mealType,
            menuItems: !mealData.menuItems?.trim(),
            mealDate: !mealData.mealDate
        };
        
        setFormErrors(errors);
        return !Object.values(errors).some(x => x);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
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

    // Get icon based on meal type
    const getMealTypeIcon = (type) => {
        switch(type) {
            case 'BREAKFAST':
                return <BreakfastIcon />;
            case 'LUNCH':
                return <LunchIcon />;
            case 'DINNER':
                return <DinnerIcon />;
            default:
                return null;
        }
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose} 
                maxWidth="sm" 
                fullWidth
                TransitionComponent={Transition}
                PaperProps={{
                    elevation: 5,
                    sx: { 
                        borderRadius: '16px', 
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: initialData && initialData.id ? '#1976d2' : '#2e7d32',
                    color: 'white',
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" component="div">
                        {initialData && initialData.id ? 'Edit Meal' : 'Create New Meal'}
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ pt: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl 
                                    fullWidth 
                                    error={formErrors.mealType}
                                >
                                    <InputLabel>Meal Type</InputLabel>
                                    <Select
                                        name="mealType"
                                        value={mealData.mealType || ''}
                                        onChange={handleChange}
                                        required
                                        startAdornment={
                                            mealData.mealType ? (
                                                <InputAdornment position="start">
                                                    {getMealTypeIcon(mealData.mealType)}
                                                </InputAdornment>
                                            ) : null
                                        }
                                    >
                                        <MenuItem value="BREAKFAST">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BreakfastIcon sx={{ mr: 1, color: '#ff9800' }} />
                                                Breakfast
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="LUNCH">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LunchIcon sx={{ mr: 1, color: '#2196f3' }} />
                                                Lunch
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="DINNER">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <DinnerIcon sx={{ mr: 1, color: '#673ab7' }} />
                                                Dinner
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                    {formErrors.mealType && (
                                        <FormHelperText>Please select a meal type</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    name="menuItems"
                                    label="Menu Items"
                                    fullWidth
                                    value={mealData.menuItems || ''}
                                    onChange={handleChange}
                                    required
                                    error={formErrors.menuItems}
                                    helperText={formErrors.menuItems ? "Please enter menu items" : ""}
                                    multiline
                                    rows={3}
                                    placeholder="Enter dishes, ingredients, or meal description"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <NotesIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    name="mealDate"
                                    label="Meal Date"
                                    type="date"
                                    fullWidth
                                    value={mealData.mealDate || ''}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    error={formErrors.mealDate}
                                    helperText={formErrors.mealDate ? "Please select a date" : ""}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TodayIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color={initialData && initialData.id ? "primary" : "success"}
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        py: 1.5,
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {initialData && initialData.id ? 'Update Meal' : 'Create Meal'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Snackbar 
                open={showError} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <Alert 
                    onClose={handleCloseError} 
                    severity="error" 
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateMeal;