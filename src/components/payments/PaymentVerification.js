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
    DialogActions,
    TextField,
    Typography,
    Container,
    Card,
    CardContent,
    Box,
    Avatar,
    styled,
    CircularProgress,
    Divider,
    Alert
} from '@mui/material';
import { paymentService } from '../../services/paymentService';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundImage: 'url("https://img.freepik.com/premium-vector/bill-expenses-is-mobile-phonepay-bills-with-mobile-phoneonline-shopping-spendingpayment_196604-154.jpg?w=2000")', // Placeholder for background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // White overlay for better readability
        zIndex: 0
    }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1
}));

const HeaderCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
}));

const HeaderContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3)
}));

const HeaderIcon = styled(Box)(({ theme }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    overflow: 'hidden'
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: 'linear-gradient(90deg, #f5f7fa 0%, #e9ecef 100%)'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    padding: theme.spacing(2)
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: theme.spacing(1, 3),
    textTransform: 'none',
    fontWeight: 'bold'
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(90deg, #f5f7fa 0%, #e9ecef 100%)',
    padding: theme.spacing(2, 3)
}));

const PaymentDetailsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(3)
}));

const PaymentDetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4)
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(4)
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2)
}));

const PaymentVerification = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [actionResult, setActionResult] = useState({ show: false, success: false, message: '' });

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        setLoading(true);
        try {
            const payments = await paymentService.getPendingPayments();
            setPendingPayments(payments);
        } catch (error) {
            console.error('Failed to fetch pending payments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (paymentId, isApproved) => {
        setProcessingPayment(true);
        try {
            if (isApproved) {
                await paymentService.verifyPayment(paymentId, remarks);
                setActionResult({
                    show: true,
                    success: true,
                    message: 'Payment approved successfully!'
                });
            } else {
                await paymentService.rejectPayment(paymentId, remarks);
                setActionResult({
                    show: true,
                    success: true,
                    message: 'Payment rejected successfully!'
                });
            }
            
            // Wait briefly to show the success message
            setTimeout(() => {
                setOpenVerifyDialog(false);
                setActionResult({ show: false, success: false, message: '' });
                fetchPendingPayments();
            }, 1500);
            
        } catch (error) {
            console.error('Failed to process payment', error);
            setActionResult({
                show: true,
                success: false,
                message: 'Failed to process payment. Please try again.'
            });
        } finally {
            setProcessingPayment(false);
        }
    };

    const openVerificationDialog = (payment) => {
        setSelectedPayment(payment);
        setRemarks('');
        setActionResult({ show: false, success: false, message: '' });
        setOpenVerifyDialog(true);
    };

    const formatDate = (dateArray) => {
        if (!Array.isArray(dateArray) || dateArray.length < 6) return 'N/A';
    
        try {
            const [year, month, day, hour, minute, second] = dateArray;
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

    return (
        <PageContainer maxWidth="xl">
            <ContentWrapper>
                <HeaderCard>
                    <HeaderContent>
                        <HeaderIcon>
                            <VerifiedUserIcon fontSize="large" style={{ color: 'white' }} />
                        </HeaderIcon>
                        <Typography variant="h4" component="h1" color="white">
                            Payment Verification
                        </Typography>
                    </HeaderContent>
                </HeaderCard>
                
                <Card>
                    <CardContent>
                        {loading ? (
                            <LoadingContainer>
                                <CircularProgress />
                            </LoadingContainer>
                        ) : pendingPayments.length === 0 ? (
                            <EmptyStateContainer>
                                <Typography variant="h6" color="textSecondary">
                                    No pending payments to verify
                                </Typography>
                            </EmptyStateContainer>
                        ) : (
                            <StyledTableContainer component={Paper}>
                                <Table>
                                    <StyledTableHead>
                                        <TableRow>
                                            <StyledTableCell>User</StyledTableCell>
                                            <StyledTableCell>Amount</StyledTableCell>
                                            <StyledTableCell>UTR Number</StyledTableCell>
                                            <StyledTableCell>Payment Date</StyledTableCell>
                                            <StyledTableCell align="center">Actions</StyledTableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {pendingPayments.map((payment) => (
                                            <TableRow key={payment.id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar 
                                                            sx={{ 
                                                                bgcolor: 'primary.main',
                                                                width: 32,
                                                                height: 32,
                                                                marginRight: 1
                                                            }}
                                                        >
                                                            {payment.userName.charAt(0)}
                                                        </Avatar>
                                                        {payment.userName}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography fontWeight="bold">
                                                        ₹{payment.amount.toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{payment.utrNumber}</TableCell>
                                                <TableCell>
                                                    {formatDate(payment.paymentDate)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <StyledButton 
                                                        variant="contained" 
                                                        color="primary"
                                                        onClick={() => openVerificationDialog(payment)}
                                                        startIcon={<VerifiedUserIcon />}
                                                    >
                                                        Verify
                                                    </StyledButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        )}
                    </CardContent>
                </Card>
            </ContentWrapper>

            {/* Payment Verification Dialog */}
            <Dialog 
                open={openVerifyDialog} 
                onClose={() => !processingPayment && setOpenVerifyDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <StyledDialogTitle>
                    Payment Verification
                </StyledDialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <>
                            <PaymentDetailsContainer>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Payment Details
                                </Typography>
                                <PaymentDetailItem>
                                    <Typography variant="body2" color="textSecondary">User</Typography>
                                    <Typography variant="body2" fontWeight="medium">{selectedPayment.userName}</Typography>
                                </PaymentDetailItem>
                                <PaymentDetailItem>
                                    <Typography variant="body2" color="textSecondary">Amount</Typography>
                                    <Typography variant="body2" fontWeight="bold">₹{selectedPayment.amount.toFixed(2)}</Typography>
                                </PaymentDetailItem>
                                <PaymentDetailItem>
                                    <Typography variant="body2" color="textSecondary">UTR Number</Typography>
                                    <Typography variant="body2" fontWeight="medium">{selectedPayment.utrNumber}</Typography>
                                </PaymentDetailItem>
                                <PaymentDetailItem>
                                    <Typography variant="body2" color="textSecondary">Payment Date</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {formatDate(selectedPayment.paymentDate)}
                                    </Typography>
                                </PaymentDetailItem>
                            </PaymentDetailsContainer>
                            
                            {actionResult.show && (
                                <Alert 
                                    severity={actionResult.success ? "success" : "error"}
                                    sx={{ mb: 2 }}
                                >
                                    {actionResult.message}
                                </Alert>
                            )}
                            
                            <TextField
                                label="Verification Remarks"
                                fullWidth
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter verification remarks"
                                margin="normal"
                                disabled={processingPayment}
                                multiline
                                rows={3}
                            />
                            
                            <ActionButtonContainer>
                                <StyledButton 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => handleVerifyPayment(selectedPayment.id, false)}
                                    disabled={processingPayment}
                                    startIcon={<CloseIcon />}
                                >
                                    Reject Payment
                                </StyledButton>
                                <StyledButton 
                                    variant="contained" 
                                    color="success"
                                    onClick={() => handleVerifyPayment(selectedPayment.id, true)}
                                    disabled={processingPayment}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    Approve Payment
                                </StyledButton>
                            </ActionButtonContainer>
                            
                            {processingPayment && (
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
};

export default PaymentVerification;