import React from 'react';
import { useSelector } from 'react-redux';
import IpLookupInputForm from '../components/ipLookupInput';
import IpLookupResultDisplay from '../components/ipLookupResultDisplay';
import LocationMap from '../components/locationMap';
import LoadingAnimation from '../../../../../components/loading/loading'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const IpLookupPage = () => {
    const { currentLookupResult, lookupStatus } = useSelector((state) => state.ipLookup);
    const hasCoordinates =
        currentLookupResult?.geoInfo?.latitude != null &&
        currentLookupResult?.geoInfo?.longitude != null &&
        !isNaN(parseFloat(currentLookupResult.geoInfo.latitude)) &&
        !isNaN(parseFloat(currentLookupResult.geoInfo.longitude));

    const popupText = hasCoordinates
        ? `${currentLookupResult.geoInfo.city || 'Unknown City'}, ${currentLookupResult.geoInfo.country || 'Unknown Country'}`
        : "Location";

    return (
        <Box>
            <Typography variant="h5" component="h1" gutterBottom>
                IP / Domain Lookup
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <IpLookupInputForm /> 
            </Paper>

            {lookupStatus === 'loading' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <LoadingAnimation message='ip looking...' />
                </Box>
            )}

            {lookupStatus === 'succeeded' && currentLookupResult && (
                <Box sx={{ mt: 3 }}> 
                    <IpLookupResultDisplay lookupData={currentLookupResult} />
                    {hasCoordinates && (
                        <Paper sx={{ p: 2, mt: 3 }}> 
                            <Typography variant="h6" gutterBottom align="center">Location Map</Typography>
                            <LocationMap
                                latitude={currentLookupResult.geoInfo.latitude}
                                longitude={currentLookupResult.geoInfo.longitude}
                                popupText={popupText}
                            />
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default IpLookupPage;