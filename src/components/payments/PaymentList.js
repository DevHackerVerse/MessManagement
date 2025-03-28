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
    Chip,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import { paymentService } from '../../services/paymentService';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, [activeTab]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            let paymentData;
            if (activeTab === 0) {
                paymentData = await paymentService.getPendingPayments();
            } else {
                paymentData = await paymentService.getAllPayments();
            }
            
            console.log('Fetched Payments:', paymentData);
            setPayments(paymentData);
        } catch (error) {
            console.error('Failed to fetch payments', error);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateArray) => {
        if (!Array.isArray(dateArray) || dateArray.length < 6) return 'N/A';
    
        try {
            // Backend returns [year, month, day, hour, minute, second, nanoseconds]
            const [year, month, day, hour, minute, second] = dateArray;
    
            // JavaScript months are 0-based, so subtract 1 from the month
            const date = new Date(year, month - 1, day, hour, minute, second);
    
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };
    
    

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'SUCCESS': return 'success';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Payment Management
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Pending Payments" />
                    <Tab label="All Payments" />
                </Tabs>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : payments.length === 0 ? (
                <Typography>No payments found</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>UTR Number</TableCell>
                                <TableCell>Payment Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.userId}</TableCell>
                                    <TableCell>{payment.userName}</TableCell>
                                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>{payment.utrNumber}</TableCell>
                                    <TableCell>
                                        {formatDate(payment.paymentDate)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={payment.status} 
                                            color={getStatusColor(payment.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default PaymentList;