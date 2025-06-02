import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';

const ProfileRender = () => {
    return (
        <Box>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" />
                    </Grid>
                ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={80} />
        </Box>
    )
}

export default ProfileRender