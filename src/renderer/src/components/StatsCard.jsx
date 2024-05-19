import { Box, Card, CardContent, Link, Typography } from '@mui/joy';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ title, value, icon, link }) => {
    const navigate = useNavigate();
    return (
        <Link onClick={() => navigate(link)} underline='none' sx={{ width: '100%' }}>
            <Card
                variant="outlined"
                orientation="horizontal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: 'lg',
                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                    {icon}
                </Box>
                <CardContent sx={{ pl: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography level="body-md" id="card-description">
                        {title}
                    </Typography>
                    <Typography level="h3" aria-describedby="card-description" mb={1}>
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    )
}

export default StatsCard;
