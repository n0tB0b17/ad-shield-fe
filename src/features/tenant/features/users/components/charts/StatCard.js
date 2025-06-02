import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const StatCard = ({ title, value, isDate = false }) => {
    return (
        <Card sx={{
            p: 2,
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
        }}>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant={isDate ? "body2" : "h5"} component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatCard;