import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.registerUser(formData);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4">Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <MenuItem value="USER">User</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                </FormControl>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                >
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;