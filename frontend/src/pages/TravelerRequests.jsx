import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axiosInstance from '../api/Axios.jsx';

function TravelerRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("auth"));
                if (!userData) {
                    alert("User not logged in. Please log in.");
                    navigate('/login');
                    return;
                }

                const travelerId = userData.user._id;
                const token = userData.token;

                const response = await axiosInstance.get(`travelrequests/traveler/${travelerId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setRequests(response.data);
                } else {
                    alert('No requests found');
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
                alert('Error fetching requests');
            }
        };

        fetchRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography component="h2" variant="h4" color="primary" gutterBottom>
                    Travel Requests
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="travel requests table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Budget</TableCell>
                                <TableCell>Travellers</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <TableRow key={request._id}>
                                        <TableCell>{request.title}</TableCell>
                                        <TableCell>{request.source}</TableCell>
                                        <TableCell>{request.destination}</TableCell>
                                        <TableCell>{request.startDate}</TableCell>
                                        <TableCell>{request.endDate}</TableCell>
                                        <TableCell>${request.budget}</TableCell>
                                        <TableCell>{request.numOfTravellers}</TableCell>
                                        <TableCell>{request.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No travel requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
}

export default TravelerRequests;
