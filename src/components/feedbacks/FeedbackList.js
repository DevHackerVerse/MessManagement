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
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField,
    Box,
    Container,
    Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import { feedbackService } from '../../services/feedbackService';

// Styled components for better UI
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(3),
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
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    padding: theme.spacing(4, 0),
    borderRadius: '0 0 15% 15%',
    marginBottom: theme.spacing(4),
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
        opacity: 0.2,
        borderRadius: '0 0 15% 15%',
        zIndex: 0,
    }
}));

const ContentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    padding: theme.spacing(0.5, 2),
    textTransform: 'none',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    width: 32,
    height: 32,
    fontSize: '0.9rem',
    marginRight: theme.spacing(1),
}));

const UserCell = styled(TableCell)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const feedbackData = await feedbackService.getAllFeedbacks();
            setFeedbacks(feedbackData);
        } catch (error) {
            console.error('Failed to fetch feedbacks', error);
        }
    };

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setOpenDetailDialog(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'REVIEWED': return 'primary';
            case 'RESOLVED': return 'success';
            default: return 'default';
        }
    };

    const handleResolveFeedback = async (feedbackId, response) => {
        try {
            await feedbackService.resolveFeedback(feedbackId, response);
            fetchFeedbacks();
            setOpenDetailDialog(false);
        } catch (error) {
            console.error('Failed to resolve feedback', error);
        }
    };

    // Function to get initials for avatar
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
    };

    const formatDate = (createdAtArray) => {
        if (!Array.isArray(createdAtArray) || createdAtArray.length < 6) return "Invalid Date";
    
        // Extract date components
        const [year, month, day, hour, minute, second] = createdAtArray;
    
        // Construct JavaScript Date object (months are 0-based in JS)
        return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
    };

    return (
        <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh',
            backgroundImage: 'url("/api/placeholder/1600/900")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pb: 4
        }}>
            <HeaderBox>
                <ContentBox>
                    <CommentIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h3" fontWeight="bold">
                        Feedback Management
                    </Typography>
                    <Typography variant="subtitle1">
                        Review and manage all user feedback in one place
                    </Typography>
                </ContentBox>
            </HeaderBox>
            
            <Container maxWidth="lg">
                <Paper sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <Typography variant="h4" gutterBottom color="primary" fontWeight="medium">
                        Feedback List
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Showing all feedback entries. Click on "View Details" to see full message and respond.
                    </Typography>
                    
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
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
                                        <UserCell>
                                            <UserAvatar>{getInitials(feedback.userName)}</UserAvatar>
                                            {feedback.userName}
                                        </UserCell>
                                        <TableCell>
                                            {feedback.message.length > 50 
                                                ? `${feedback.message.substring(0, 50)}...` 
                                                : feedback.message}
                                        </TableCell>
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
                                                onClick={() => handleViewDetails(feedback)}
                                                startIcon={<VisibilityIcon />}
                                            >
                                                View Details
                                            </ActionButton>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                                {feedbacks.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No feedback entries found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                </Paper>
            </Container>

            {/* Feedback Details Dialog */}
            <Dialog 
                open={openDetailDialog} 
                onClose={() => setOpenDetailDialog(false)}
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
                {selectedFeedback && (
                    <>
                        <DialogTitle sx={{ 
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderBottom: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            Feedback Details
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <UserAvatar sx={{ width: 48, height: 48, fontSize: '1.2rem', mr: 2 }}>
                                    {getInitials(selectedFeedback.userName)}
                                </UserAvatar>
                                <Box>
                                    <Typography variant="h6">{selectedFeedback.userName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Created At: {new Date(selectedFeedback.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={selectedFeedback.status} 
                                    color={getStatusColor(selectedFeedback.status)}
                                    size="small"
                                    sx={{ ml: 'auto', fontWeight: 'bold' }}
                                />
                            </Box>
                            
                            <TextField
                                label="Feedback Message"
                                multiline
                                fullWidth
                                rows={4}
                                value={selectedFeedback.message}
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        bgcolor: 'rgba(0,0,0,0.02)'
                                    }
                                }}
                            />

                            {selectedFeedback.adminResponse && (
                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,123,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,123,255,0.2)' }}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                        Admin Response
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {selectedFeedback.adminResponse}
                                    </Typography>
                                </Box>
                            )}

                            {selectedFeedback.status === 'PENDING' && (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => {
                                        const response = prompt('Enter your response:');
                                        if (response) {
                                            handleResolveFeedback(
                                                selectedFeedback.id, 
                                                response
                                            );
                                        }
                                    }}
                                    fullWidth
                                    startIcon={<DoneIcon />}
                                    sx={{ 
                                        mt: 3, 
                                        py: 1.5, 
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,123,255,0.25)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Resolve Feedback
                                </Button>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default FeedbackList;