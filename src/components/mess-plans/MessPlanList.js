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
    Typography 
} from '@mui/material';
import { messPlanService } from '../../services/messPlanService';
import CreateMessPlan from './CreateMessPlan';

const MessPlanList = () => {
    const [messPlans, setMessPlans] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        fetchMessPlans();
    }, []);

    const fetchMessPlans = async () => {
        try {
            const plans = await messPlanService.getAllMessPlans();
            setMessPlans(plans);
        } catch (error) {
            console.error('Failed to fetch mess plans', error);
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

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Mess Plans
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setSelectedPlan(null);
                    setOpenDialog(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Create New Mess Plan
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Total Days</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messPlans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>{plan.totalDays}</TableCell>
                                <TableCell>₹{plan.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleEdit(plan)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDelete(plan.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {openDialog && (
                <CreateMessPlan
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSuccess={fetchMessPlans}
                    initialData={selectedPlan}
                />
            )}
        </div>
    );
};

export default MessPlanList;