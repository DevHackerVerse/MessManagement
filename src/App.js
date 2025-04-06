import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Import Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import UserList from './components/users/UserList';
import UserManagement from './components/users/UserManagement';
import MealList from './components/meals/MealList';
import PaymentVerification from './components/payments/PaymentVerification';
import PaymentList from './components/payments/PaymentList';
import FeedbackManagement from './components/feedbacks/FeedbackManagement';
import FeedbackList from './components/feedbacks/FeedbackList'
import MessPlanManagement from './components/mess-plans/MessPlanManagement';
import Layout from './components/common/Layout';
import Header from './components/common/Header';
import PrivateRoute from './components/common/PrivateRoute';

// Create Material-UI Theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />
                        <Route 
                            path="/users" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        
                                        <UserList/>
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />
                        <Route 
                            path="/meals" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        <MealList />
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />
                        <Route 
                            path="/payments" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        <PaymentVerification />
                                        <PaymentList />
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />
                        <Route 
                            path="/feedbacks" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        <FeedbackList />
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />
                        <Route 
                            path="/mess-plans" 
                            element={
                                <Layout>
                                    <PrivateRoute>
                                        <MessPlanManagement />
                                    </PrivateRoute>
                                </Layout>
                            } 
                        />

                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;