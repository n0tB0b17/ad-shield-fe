import React, { useMemo } from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import { parseISO, format } from 'date-fns';
import BarChartComponent from '../../../../../components/charts/BarChartComponent';
import PieChartComponent from '../../../../../components/charts/PieChartComponent';
import RadarChartComponent from '../../../../../components/charts/RadarChartComponent';

const PortScanDashboard = ({ scanHistory }) => {
  const theme = useTheme();

  const portDistributionData = useMemo(() => {
    if (!scanHistory || scanHistory.length === 0) {
      return [];
    }

    const portCounts = {};

    scanHistory.forEach(scan => {
      if (scan.scanResultDetail && Array.isArray(scan.scanResultDetail)) {
        scan.scanResultDetail.forEach(result => {
          const port = result.port;
          portCounts[port] = (portCounts[port] || 0) + 1;
        });
      }
    });

    return Object.keys(portCounts).map(port => ({
      name: `Port ${port}`,
      value: portCounts[port]
    }));
  }, [scanHistory]);

  // Data for Scan Duration Chart
  const scanDurationData = useMemo(() => {
    if (!scanHistory || scanHistory.length === 0) {
      return [];
    }

    return scanHistory.map(scan => ({
      name: scan.id ? scan.id.substring(scan.id.length - 4) : 'unknown',
      value: scan.scanDuration ? scan.scanDuration / 1_000_000_000 : 0,
      date: scan.scanStartTime ? format(parseISO(scan.scanStartTime), 'MM/dd') : 'Unknown',
    })).slice(-7);
  }, [scanHistory]);

  // Data for Service Distribution Chart
  const serviceDistributionData = useMemo(() => {
    if (!scanHistory || scanHistory.length === 0) {
      return [];
    }

    const serviceCounts = {};

    scanHistory.forEach(scan => {
      if (scan.scanResultDetail && Array.isArray(scan.scanResultDetail)) {
        scan.scanResultDetail.forEach(result => {
          const service = result.service || 'unknown';
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        });
      }
    });

    return Object.keys(serviceCounts).map(service => ({
      name: service,
      value: serviceCounts[service]
    }));
  }, [scanHistory]);

  // Data for Timeline Visualization
  const timelineData = useMemo(() => {
    if (!scanHistory || scanHistory.length === 0) {
      return [];
    }

    return scanHistory.map(scan => {
      const startDate = scan.scanStartTime ? new Date(scan.scanStartTime) : null;
      const ipLastOctet = scan.targetAddress ? parseInt(scan.targetAddress.split('.').pop()) : 0;

      return {
        name: startDate ? format(startDate, 'MM/dd HH:mm') : 'Unknown',
        value: ipLastOctet,
        size: (scan.scanDuration ? scan.scanDuration / 1_000_000_000 : 0) / 10,
        address: scan.targetAddress || 'unknown',
        ports: scan.requestedPortRange || 'N/A',
        status: scan.status || 'unknown'
      };
    });
  }, [scanHistory]);

  if (!scanHistory || scanHistory.length === 0 ||
    !portDistributionData.length || !serviceDistributionData.length) {
    return null;
  }

  const durationTooltip = ({ payload }) => {
    if (!payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid', borderColor: 'divider' }}>
        <p>{`Scan ID: ${data.name}`}</p>
        <p>{`Duration: ${data.value.toFixed(2)}s`}</p>
        <p>{`Date: ${data.date}`}</p>
      </Box>
    );
  };

  return (
    <Box sx={{
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
        {/* Port Distribution Chart */}
        <Grid item xs={12} lg={6}>
          <BarChartComponent
            title="Open Port Distribution"
            data={portDistributionData}
            dataKey="value"
            height={350}
            barColor={theme.palette.primary.main}
            paperProps={{
              sx: {
                height: '100%',
              }
            }}
          />
        </Grid>

        {/* Scan Duration Chart */}
        <Grid item xs={12} lg={6}>
          <BarChartComponent
            title="Scan Duration Trend (seconds)"
            data={scanDurationData}
            dataKey="value"
            xAxisKey="date"
            height={350}
            barColor={theme.palette.secondary.main}
            CustomTooltip={durationTooltip}
            paperProps={{
              sx: {
                height: '100%',
              }
            }}
          />
        </Grid>

        {/* Service Type Distribution */}
        <Grid item xs={12} lg={6}>
          <PieChartComponent
            title="Service Type Distribution"
            data={serviceDistributionData}
            height={350}
            paperProps={{
              sx: {
                height: '100%',
                mt: 2,
              }
            }}
          />
        </Grid>

        {/* Timeline Visualization */}
        <Grid item xs={12} lg={6}>
          <RadarChartComponent
            title="Scan Activity Pattern"
            data={timelineData}
            dataKey="value"
            angleAxisKey="name"
            height={350}
            color={theme.palette.info.main}
            CustomTooltip={({ payload }) => {
              if (!payload || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid', borderColor: 'divider' }}>
                  <p>{`Time: ${data.name}`}</p>
                  <p>{`IP: ${data.address}`}</p>
                  <p>{`Ports: ${data.ports}`}</p>
                  <p>{`Status: ${data.status}`}</p>
                </Box>
              );
            }}
            paperProps={{
              sx: {
                height: '100%',
                mt: 2,
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortScanDashboard;