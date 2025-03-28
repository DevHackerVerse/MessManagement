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
    Typography
} from '@mui/material';
import { paymentService } from '../../services/paymentService';

const PaymentVerification = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const payments = await paymentService.getPendingPayments();
            setPendingPayments(payments);
        } catch (error) {
            console.error('Failed to fetch pending payments', error);
        }
    };

    const handleVerifyPayment = async (paymentId, isApproved) => {
        try {
            if (isApproved) {
                await paymentService.verifyPayment(paymentId, remarks);
            } else {
                await paymentService.rejectPayment(paymentId, remarks);
            }
            fetchPendingPayments();
            setOpenVerifyDialog(false);
        } catch (error) {
            console.error('Failed to process payment', error);
        }
    };

    const openVerificationDialog = (payment) => {
        setSelectedPayment(payment);
        setOpenVerifyDialog(true);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Payment Verification
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>UTR Number</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.userName}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell>{payment.utrNumber}</TableCell>
                                <TableCell>
                                    {new Date(payment.paymentDate).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => openVerificationDialog(payment)}
                                    >
                                        Verify
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payment Verification Dialog */}
            <Dialog 
                open={openVerifyDialog} 
                onClose={() => setOpenVerifyDialog(false)}
            >
                <DialogTitle>Payment Verification</DialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <>
                            <TextField
                                label="Remarks"
                                fullWidth
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter verification remarks"
                                margin="normal"
                            />
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => handleVerifyPayment(selectedPayment.id, true)}
                                style={{ marginRight: 10 }}
                            >
                                Approve Payment
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => handleVerifyPayment(selectedPayment.id, false)}
                            >
                                Reject Payment
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaymentVerification;