import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e', // Red
            light: '#ff4081',
            dark: '#9a0036',
        },
        background: {
            default: '#f4f4f4',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
        h4: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;