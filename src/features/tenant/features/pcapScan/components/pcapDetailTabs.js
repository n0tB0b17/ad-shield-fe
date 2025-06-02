import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PcapGeneralAnalysis from './pcapGeneralAnalysis';
import PcapNetworkAnalysis from './pcapNetworkAnalysis';
import PcapTransportAnalysis from './pcapTransportAnalysis';
import PcapApplicationAnalysis from './pcapApplicationAnalysis';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`pcap-tabpanel-${index}`}
            aria-labelledby={`pcap-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `pcap-tab-${index}`,
        'aria-controls': `pcap-tabpanel-${index}`,
    };
}

const PcapDetailTabs = ({ analysisData }) => {
    const [value, setValue] = useState(0); // Default to first tab

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Destructure data for easier passing (use original snake_case keys from API)
    const metaData = analysisData?.meta;
    const networkData = analysisData?.network_layer_metrics;
    const transportData = analysisData?.transport_layer_metrics;
    const appData = analysisData?.application_layer_metrics;
    const tlsData = analysisData?.application_layer_metrics?.TLSStats; // Nested TLS stats


    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Pcap analysis tabs" variant="scrollable" scrollButtons="auto">
                    <Tab label="General Info" {...a11yProps(0)} />
                    <Tab label="Network Analysis" {...a11yProps(1)} />
                    <Tab label="Transport Analysis" {...a11yProps(2)} />
                    <Tab label="Application Analysis" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <PcapGeneralAnalysis metaData={metaData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PcapNetworkAnalysis networkData={networkData} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <PcapTransportAnalysis transportData={transportData} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                 {/* Pass both application layer metrics and specific TLS stats */}
                <PcapApplicationAnalysis appData={appData} tlsData={tlsData}/>
            </TabPanel>
        </Box>
    );
};

export default PcapDetailTabs;