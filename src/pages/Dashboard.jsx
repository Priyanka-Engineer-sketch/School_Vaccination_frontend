import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import {
  Bar,
  BarChart,
  Cell, Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import vaccinationBg from '../images/schoolvaccination.png';
import useApi from '../service/ApiHook';

const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const api = useApi();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const vaccineData = [
    { name: 'Covaxin', value: 520 },
    { name: 'Covishield', value: 310 },
    { name: 'Pfizer', value: 105 }
  ];

  const studentBarData = stats ? [
    { name: 'Vaccinated', value: stats.vaccinatedStudents },
    { name: 'Unvaccinated', value: stats.totalStudents - stats.vaccinatedStudents }
  ] : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${vaccinationBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        py: 6
      }}
    >
      <Container maxWidth="lg" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 4, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          🏥 School Vaccination Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error">{error}</Alert>}

        {stats && (
          <>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">Total Students</Typography>
                  <Typography variant="h3" color="primary">
                    <CountUp end={stats.totalStudents} duration={1.5} />
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">Vaccinated Students</Typography>
                  <Typography variant="h3" color="success.main">
                    <CountUp end={stats.vaccinatedStudents} duration={1.5} />
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">Vaccination %</Typography>
                  <Typography variant="h3" color="secondary">
                    <CountUp end={stats.vaccinatedPercentage} decimals={2} duration={1.5} />%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Student Vaccination Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={studentBarData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Vaccine Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={vaccineData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {vaccineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Vaccination Drives
              </Typography>
              {stats.upcomingDrives?.length ? (
                <ul>
                  {stats.upcomingDrives.map((drive, idx) => (
                    <li key={idx}>
                      {drive.date} — {drive.timeStart} to {drive.timeEnd} at <strong>{drive.centerName}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No upcoming drives found.</Typography>
              )}
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;