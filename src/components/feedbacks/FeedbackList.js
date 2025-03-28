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
    TextField 
} from '@mui/material';
import { feedbackService } from '../../services/feedbackService';

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

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Feedback List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.map((feedback) => (
                            <TableRow key={feedback.id}>
                                <TableCell>{feedback.userName}</TableCell>
                                <TableCell>
                                    {feedback.message.length > 50 
                                        ? `${feedback.message.substring(0, 50)}...` 
                                        : feedback.message}
                                </TableCell>
                                <TableCell>
                                    {new Date(feedback.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={feedback.status} 
                                        color={getStatusColor(feedback.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleViewDetails(feedback)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Feedback Details Dialog */}
            <Dialog 
                open={openDetailDialog} 
                onClose={() => setOpenDetailDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedFeedback && (
                    <>
                        <DialogTitle>Feedback Details</DialogTitle>
                        <DialogContent>
                            <Typography variant="h6">User: {selectedFeedback.userName}</Typography>
                            <Typography variant="subtitle1">
                                Created At: {new Date(selectedFeedback.createdAt).toLocaleString()}
                            </Typography>
                            
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
                            />

                            {selectedFeedback.adminResponse && (
                                <TextField
                                    label="Admin Response"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    value={selectedFeedback.adminResponse}
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
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
                                    style={{ marginTop: 16 }}
                                >
                                    Resolve Feedback
                                </Button>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default FeedbackList;