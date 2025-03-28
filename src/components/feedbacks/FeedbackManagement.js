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
    Chip 
} from '@mui/material';
import { feedbackService } from '../../services/feedbackService';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openResolveDialog, setOpenResolveDialog] = useState(false);
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        fetchPendingFeedbacks();
    }, []);

    const fetchPendingFeedbacks = async () => {
        try {
            const pendingFeedbacks = await feedbackService.getPendingFeedbacks();
            setFeedbacks(pendingFeedbacks);
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

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
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
                                <TableCell>{feedback.id}</TableCell>
                                <TableCell>{feedback.userName}</TableCell>
                                <TableCell>{feedback.message}</TableCell>
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
                                        onClick={() => handleOpenResolveDialog(feedback)}
                                        disabled={feedback.status !== 'PENDING'}
                                    >
                                        Resolve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Feedback Resolve Dialog */}
            <Dialog 
                open={openResolveDialog} 
                onClose={() => setOpenResolveDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Resolve Feedback</DialogTitle>
                <DialogContent>
                    {selectedFeedback && (
                        <>
                            <TextField
                                label="Original Feedback"
                                fullWidth
                                multiline
                                rows={4}
                                value={selectedFeedback.message}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                label="Admin Response"
                                fullWidth
                                multiline
                                rows={4}
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Enter your response to the feedback"
                                variant="outlined"
                                margin="normal"
                            />
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleResolveFeedback}
                                fullWidth
                            >
                                Submit Response
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeedbackManagement;