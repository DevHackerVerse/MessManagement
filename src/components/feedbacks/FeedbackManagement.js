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
    Chip,
    Box,
    Typography,
    Container,
    Avatar,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReplyIcon from '@mui/icons-material/Reply';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { feedbackService } from '../../services/feedbackService';

// Styled components for enhanced UI
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    '& .MuiTable-root': {
        borderCollapse: 'separate',
        borderSpacing: 0,
    }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    '& .MuiTableCell-head': {
        color: theme.palette.common.white,
        fontWeight: 'bold',
        padding: theme.spacing(2),
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        transition: 'background-color 0.2s ease',
    },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)',
    color: 'white',
    padding: theme.spacing(5, 0),
    borderRadius: '0 0 30% 30%/50px',
    marginBottom: theme.spacing(5),
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("https://feedbacklabs.org/wp-content/uploads/2020/08/iStock-911978098-1254x627.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        borderRadius: '0 0 30% 30%/50px',
        zIndex: 0,
    }
}));

const ContentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
}));

const StatusCard = styled(Card)(({ theme, color }) => ({
    backgroundColor: color,
    color: '#fff',
    height: '100%',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    padding: theme.spacing(0.5, 2),
    textTransform: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    width: 32,
    height: 32,
    fontSize: '0.9rem',
    marginRight: theme.spacing(1),
}));

const MessageCell = styled(TableCell)(({ theme }) => ({
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

const UserCell = styled(TableCell)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openResolveDialog, setOpenResolveDialog] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [stats, setStats] = useState({
        pending: 0,
        resolved: 0,
        reviewed: 0
    });

    useEffect(() => {
        fetchPendingFeedbacks();
    }, []);

    const fetchPendingFeedbacks = async () => {
        try {
            const pendingFeedbacks = await feedbackService.getPendingFeedbacks();
            setFeedbacks(pendingFeedbacks);
            
            // Calculate stats
            const pending = pendingFeedbacks.filter(f => f.status === 'PENDING').length;
            const resolved = pendingFeedbacks.filter(f => f.status === 'RESOLVED').length;
            const reviewed = pendingFeedbacks.filter(f => f.status === 'REVIEWED').length;
            
            setStats({
                pending,
                resolved,
                reviewed,
                total: pendingFeedbacks.length
            });
        } catch (error) {
            console.error('Failed to fetch pending feedbacks', error);
        }
    };

    const handleResolveFeedback = async () => {
        try {
            await feedbackService.resolveFeedback(
                selectedFeedback.id, 
                responseText
            );
            fetchPendingFeedbacks();
            setOpenResolveDialog(false);
            setResponseText('');
        } catch (error) {
            console.error('Failed to resolve feedback', error);
        }
    };

    const handleOpenResolveDialog = (feedback) => {
        setSelectedFeedback(feedback);
        setOpenResolveDialog(true);
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'REVIEWED': return 'primary';
            case 'RESOLVED': return 'success';
            default: return 'default';
        }
    };

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
            }).format(date);
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };

    // Function to get initials for avatar
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
    };

    return (
        <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh',
            backgroundImage: 'url("/api/placeholder/1600/900")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pb: 5
        }}>
            <HeaderBox>
                <ContentBox>
                    <FeedbackIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h3" fontWeight="bold">
                        Admin Feedback Portal
                    </Typography>
                    <Typography variant="subtitle1">
                        Manage and respond to user feedback efficiently
                    </Typography>
                </ContentBox>
            </HeaderBox>
            
            <Container maxWidth="lg">
                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <StatusCard color="#FF9800">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {stats.pending}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Pending Feedback
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <AssignmentTurnedInIcon fontSize="large" />
                                </Box>
                            </CardContent>
                        </StatusCard>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatusCard color="#2196F3">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {stats.reviewed}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Reviewed Feedback
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <ReplyIcon fontSize="large" />
                                </Box>
                            </CardContent>
                        </StatusCard>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatusCard color="#4CAF50">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {stats.resolved}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Resolved Feedback
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <DoneAllIcon fontSize="large" />
                                </Box>
                            </CardContent>
                        </StatusCard>
                    </Grid>
                </Grid>
                
                <Paper sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <Typography variant="h5" color="primary" gutterBottom fontWeight="medium">
                        Feedback Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Review and respond to user feedback. Click "Resolve" to provide a response.
                    </Typography>
                    
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {feedbacks.map((feedback) => (
                                    <StyledTableRow key={feedback.id}>
                                        <TableCell>#{feedback.id}</TableCell>
                                        <UserCell>
                                            <UserAvatar>{getInitials(feedback.userName)}</UserAvatar>
                                            {feedback.userName}
                                        </UserCell>
                                        <MessageCell title={feedback.message}>
                                            {feedback.message}
                                        </MessageCell>
                                        <TableCell>
                                            {formatDate(feedback.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={feedback.status} 
                                                color={getStatusColor(feedback.status)}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <ActionButton 
                                                variant="contained" 
                                                color="primary"
                                                onClick={() => handleOpenResolveDialog(feedback)}
                                                disabled={feedback.status !== 'PENDING'}
                                                startIcon={<SendIcon />}
                                            >
                                                Resolve
                                            </ActionButton>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                                {feedbacks.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No pending feedback entries found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                </Paper>
            </Container>

            {/* Feedback Resolve Dialog */}
            <Dialog 
                open={openResolveDialog} 
                onClose={() => setOpenResolveDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
                        backgroundSize: 'cover'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                }}>
                    Resolve Feedback
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    {selectedFeedback && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <UserAvatar sx={{ width: 48, height: 48, fontSize: '1.2rem', mr: 2 }}>
                                    {getInitials(selectedFeedback.userName)}
                                </UserAvatar>
                                <Box>
                                    <Typography variant="h6">{selectedFeedback.userName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ID: #{selectedFeedback.id} • Created: {formatDate(selectedFeedback.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'rgba(0,0,0,0.04)', 
                                borderRadius: '12px', 
                                mb: 3,
                                border: '1px solid rgba(0,0,0,0.09)'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Original Feedback
                                </Typography>
                                <Typography variant="body1">
                                    {selectedFeedback.message}
                                </Typography>
                            </Box>
                            
                            <TextField
                                label="Admin Response"
                                fullWidth
                                multiline
                                rows={5}
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Type your response to the user's feedback..."
                                variant="outlined"
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    }
                                }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleResolveFeedback}
                                fullWidth
                                disabled={!responseText.trim()}
                                startIcon={<SendIcon />}
                                sx={{ 
                                    mt: 2, 
                                    py: 1.5, 
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,123,255,0.25)',
                                    fontWeight: 'bold'
                                }}
                            >
                                Submit Response
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default FeedbackManagement;