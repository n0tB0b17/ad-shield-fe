import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';


const PlaceholderPage = ({ title }) => (
    <Box sx={{ p: 3 }}><Paper sx={{ p: 4 }}><Typography variant="h4">{title || 'Coming Soon'}</Typography><Typography>This feature is under construction.</Typography></Paper></Box>
);
export default PlaceholderPage;

