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
    Box,
    Container,
    CircularProgress,
    Card,
    CardContent,
    styled
} from '@mui/material';
import { paymentService } from '../../services/paymentService';
import MoneyIcon from '@mui/icons-material/Money';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/000/638/078/non_2x/3d-isometric-secure-online-payment-by-smartphone-concept-online-shopping-secure-bank-transaction-with-password-and-finger-print-verification-vector.jpg")', // Placeholder for background image
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
    background: 'linear-gradient(135deg, #3a8ffe 0%, #1c5dc6 100%)',
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

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1rem',
    '&.Mui-selected': {
        color: theme.palette.primary.main
    }
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4)
}));

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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Pending';
            case 'SUCCESS': return 'Successful';
            case 'FAILED': return 'Failed';
            default: return status;
        }
    };

    return (
        <PageContainer maxWidth="xl">
            <ContentWrapper>
                <HeaderCard>
                    <HeaderContent>
                        <HeaderIcon>
                            <MoneyIcon fontSize="large" style={{ color: 'white' }} />
                        </HeaderIcon>
                        <Typography variant="h4" component="h1" color="white">
                            Payment Management
                        </Typography>
                    </HeaderContent>
                </HeaderCard>
                
                <Card>
                    <CardContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
                            <Tabs 
                                value={activeTab} 
                                onChange={handleTabChange} 
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <StyledTab 
                                    label="Pending Payments" 
                                    icon={<AccountBalanceWalletIcon />}
                                    iconPosition="start" 
                                />
                                <StyledTab 
                                    label="All Payments" 
                                    icon={<MoneyIcon />}
                                    iconPosition="start" 
                                />
                            </Tabs>
                        </Box>

                        {loading ? (
                            <LoadingContainer>
                                <CircularProgress />
                            </LoadingContainer>
                        ) : payments.length === 0 ? (
                            <Box sx={{ textAlign: 'center', padding: 4 }}>
                                <Typography variant="h6" color="textSecondary">
                                    No payments found
                                </Typography>
                            </Box>
                        ) : (
                            <StyledTableContainer component={Paper}>
                                <Table>
                                    <StyledTableHead>
                                        <TableRow>
                                            <StyledTableCell>User ID</StyledTableCell>
                                            <StyledTableCell>User Name</StyledTableCell>
                                            <StyledTableCell>Amount</StyledTableCell>
                                            <StyledTableCell>UTR Number</StyledTableCell>
                                            <StyledTableCell>Payment Date</StyledTableCell>
                                            <StyledTableCell>Status</StyledTableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {payments.map((payment) => (
                                            <TableRow key={payment.id} hover>
                                                <TableCell>{payment.userId}</TableCell>
                                                <TableCell>{payment.userName}</TableCell>
                                                <TableCell>
                                                    <Typography fontWeight="bold">
                                                        ₹{payment.amount.toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{payment.utrNumber}</TableCell>
                                                <TableCell>
                                                    {formatDate(payment.paymentDate)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={getStatusLabel(payment.status)} 
                                                        color={getStatusColor(payment.status)}
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
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
        </PageContainer>
    );
};

export default PaymentList;