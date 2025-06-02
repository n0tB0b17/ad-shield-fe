import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLookupById, clearSelectedLookup } from '../ipLookupSlice';
import IpLookupDetailDisplay from '../components/ipLookupDetailDisplay';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LocationMap from '../components/locationMap'
import LoadingClientAnimation from '../../../../../components/loading/loading';
import ErrorAnimation from '../../../../../components/loading/error'
import NotFoundAnimation from '../../../../../components/loading/notFound'


const IpLookupDetailPage = () => {
    const { clientId, lookupId } = useParams(); // Get both params
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedLookupDetail,
        detailStatus,
        detailError
    } = useSelector((state) => state.ipLookup);

    useEffect(() => {
        if (clientId && lookupId) {
            dispatch(fetchLookupById({ clientId, lookupId }));
        }
        return () => {
            dispatch(clearSelectedLookup());
        };
    }, [clientId, lookupId, dispatch]);

    let content;
    let map;

    if (detailStatus === 'loading') {
        content = <LoadingClientAnimation message='loading lookup data' />;
    } else if (detailStatus === 'succeeded' && selectedLookupDetail) {
        content = <IpLookupDetailDisplay lookupDetail={selectedLookupDetail} />;

        selectedLookupDetail.geoInfo === null ?
            map = <NotFoundAnimation message='no geo-location information found' /> :
            map = <LocationMap
                latitude={selectedLookupDetail.geoInfo.latitude}
                longitude={selectedLookupDetail.geoInfo.longitude} />;
    } else if (detailStatus === 'failed') {
        content = <ErrorAnimation message={detailError || 'Could not load lookup details.'} />;
    } else if (detailStatus !== 'loading' && !selectedLookupDetail) {
        content = <NotFoundAnimation message='Lookup details not found.' />
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/ip-lookup/history`)}
                    sx={{ mr: 2 }}
                >
                    Back to History
                </Button>
                <Typography variant="h5" component="h1">
                    Lookup Details
                </Typography>
            </Box>
            <Paper sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Add padding within paper */}
                {content}
            </Paper>

            <Paper>
                {map}
            </Paper>
        </Box>
    );
};

export default IpLookupDetailPage;