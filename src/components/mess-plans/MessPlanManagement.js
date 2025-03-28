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
    TextField 
} from '@mui/material';
import { messPlanService } from '../../services/messPlanService';

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
        <div>
            <Typography variant="h4" gutterBottom>
                Mess Plan Management
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={openCreateDialog}
                style={{ marginBottom: 16 }}
            >
                Create New Mess Plan
            </Button>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : messPlans.length === 0 ? (
                <Typography>No mess plans found</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Total Days</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messPlans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell>{plan.id}</TableCell>
                                    <TableCell>{plan.name}</TableCell>
                                    <TableCell>{plan.totalDays}</TableCell>
                                    <TableCell>${plan.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => openEditDialog(plan)}
                                            style={{ marginRight: 8 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="error"
                                            onClick={() => handleDeletePlan(plan.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Create/Edit Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {selectedPlan?.id ? 'Edit Mess Plan' : 'Create Mess Plan'}
                </DialogTitle>
                <DialogContent>
                    {selectedPlan && (
                        <>
                            <TextField
                                label="Plan Name"
                                fullWidth
                                margin="normal"
                                value={selectedPlan.name}
                                onChange={(e) => setSelectedPlan({
                                    ...selectedPlan, 
                                    name: e.target.value
                                })}
                            />
                            <TextField
                                label="Total Days"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={selectedPlan.totalDays}
                                onChange={(e) => setSelectedPlan({
                                    ...selectedPlan, 
                                    totalDays: parseInt(e.target.value)
                                })}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={selectedPlan.price}
                                onChange={(e) => setSelectedPlan({
                                    ...selectedPlan, 
                                    price: parseFloat(e.target.value)
                                })}
                            />
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleCreateOrUpdatePlan}
                                fullWidth
                                style={{ marginTop: 16 }}
                            >
                                {selectedPlan.id ? 'Update' : 'Create'}
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessPlanManagement;