import React, { useMemo } from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import BarChartComponent from '../../../../../components/charts/BarChartComponent';
import PieChartComponent from '../../../../../components/charts/PieChartComponent';
import RadarChartComponent from '../../../../../components/charts/RadarChartComponent';

const SERVICE_COLORS = {
  'ssh': '#0088FE',
  'http': '#00C49F',
  'https': '#82ca9d',
  'ftp': '#FFBB28',
  'smtp': '#FF8042',
  'msrpc': '#8884d8',
  'microsoft-ds': '#ff4d4d',
  'dns': '#c16dff',
  'default': '#999999'
};

const PortScanDetailCharts = ({ scanDetail }) => {
  const theme = useTheme();

  // Data for Port Status Distribution
  const portStatusData = useMemo(() => {
    const statuses = {};
    
    scanDetail.scanResultDetail.forEach(port => {
      const status = port.status || 'unknown';
      statuses[status] = (statuses[status] || 0) + 1;
    });
    
    return Object.keys(statuses).map(status => ({
      name: status,
      value: statuses[status]
    }));
  }, [scanDetail]);

  // Data for Open Port Services
  const openPortsData = useMemo(() => {
    const openPorts = scanDetail.scanResultDetail.filter(port => port.status === 'open');
    
    return openPorts.sort((a, b) => a.port - b.port).map(port => ({
      port: port.port,
      service: port.service || 'unknown',
      value: Math.min(10, Math.max(1, Math.log10(port.port) * 2))
    }));
  }, [scanDetail]);

  // Data for Service Type Distribution
  const serviceTypeData = useMemo(() => {
    const services = {};
    
    scanDetail.scanResultDetail.forEach(port => {
      if (port.status === 'open') {
        const service = port.service || 'unknown';
        services[service] = (services[service] || 0) + 1;
      }
    });
    
    return Object.keys(services).map(service => ({
      name: service,
      value: services[service],
      color: SERVICE_COLORS[service] || SERVICE_COLORS.default
    }));
  }, [scanDetail]);

  // Open ports grouping by common categories
  const portCategories = useMemo(() => {
    const categories = {
      'Standard Services (0-1023)': 0,
      'Registered Ports (1024-49151)': 0,
      'Dynamic/Private (49152-65535)': 0
    };
    
    scanDetail.scanResultDetail.forEach(port => {
      if (port.status === 'open') {
        const portNum = port.port;
        if (portNum >= 0 && portNum <= 1023) {
          categories['Standard Services (0-1023)']++;
        } else if (portNum >= 1024 && portNum <= 49151) {
          categories['Registered Ports (1024-49151)']++;
        } else {
          categories['Dynamic/Private (49152-65535)']++;
        }
      }
    });
    
    return Object.keys(categories).map(range => ({
      name: range,
      value: categories[range]
    }));
  }, [scanDetail]);

  if (!scanDetail || !scanDetail.scanResultDetail || scanDetail.scanResultDetail.length === 0) {
    return null;
  }

  const serviceTooltip = ({ payload }) => {
    if (!payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid', borderColor: 'divider' }}>
        <p>{`Service: ${data.name}`}</p>
        <p>{`Count: ${data.value}`}</p>
      </Box>
    );
  };

  const portTooltip = ({ payload }) => {
    if (!payload || !payload.length) return null;
    const port = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid', borderColor: 'divider' }}>
        <p>{`Port ${port.port} (${port.service})`}</p>
        <p>Detected</p>
      </Box>
    );
  };
  
  return (
    <Box sx={{ 
      mt: 4, 
      mb: 4,
      width: '100%',
      minWidth: '650px', // Match table's minWidth
      '& .MuiPaper-root': {
        boxShadow: theme.shadows[2],
      }
    }}>
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          width: '100%',
          margin: 0,
          '& .MuiGrid-item': {
            paddingTop: 3,
            paddingLeft: 3,
          }
        }}
      >
        {/* Open Services Distribution */}
        <Grid item xs={12} lg={4}>
          <BarChartComponent
            title="Open Services Distribution"
            data={serviceTypeData}
            dataKey="value"
            xAxisKey="name"
            height={350}
            barColor={theme.palette.primary.main}
            CustomTooltip={serviceTooltip}
            paperProps={{
              sx: {
                height: '100%',
              }
            }}
          />
        </Grid>
        
        {/* Port Categories */}
        <Grid item xs={12} lg={4}>
          <PieChartComponent
            title="Port Categories"
            data={portCategories}
            height={350}
            CustomTooltip={({ payload }) => {
              if (!payload || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid', borderColor: 'divider' }}>
                  <p>{`${data.name}`}</p>
                  <p>{`${data.value} ports`}</p>
                </Box>
              );
            }}
            paperProps={{
              sx: {
                height: '100%',
              }
            }}
          />
        </Grid>


        {/* Port Scan Footprint */}
        {/* <Grid item xs={12}>
          <RadarChartComponent
            title="Port Scan Footprint"
            data={openPortsData}
            dataKey="value"
            angleAxisKey="port"
            color={theme.palette.primary.main}
            CustomTooltip={portTooltip}
            height={400}
            paperProps={{
              sx: {
                mt: 2,
              }
            }}
          />
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default PortScanDetailCharts;