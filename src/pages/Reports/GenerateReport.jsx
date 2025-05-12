
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useApi from '../../service/ApiHook';

const GenerateReport = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = useApi();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [studentsRes, drivesRes] = await Promise.all([
        api.get('/report/students'),
        api.get('/report/upcoming')
      ]);
      setStudents(studentsRes.data);
      setDrives(drivesRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box m={3}>
      <Typography variant="h5">Student Report</Typography>
      <Button variant="outlined" onClick={() => downloadJSON(students, 'students-report.json')}>
        Download Students JSON
      </Button>
      <Paper sx={{ mt: 2, mb: 4, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Vaccinated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.firstName} {s.lastName}</TableCell>
                <TableCell>{s.className}</TableCell>
                <TableCell>{s.section}</TableCell>
                <TableCell>{s.vaccinated ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="h5">Upcoming Vaccination Drives</Typography>
      <Button variant="outlined" onClick={() => downloadJSON(drives, 'upcoming-drives-report.json')}>
        Download Drives JSON
      </Button>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Center</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drives.map((d, i) => (
              <TableRow key={i}>
                <TableCell>{d.date}</TableCell>
                <TableCell>{d.timeStart}</TableCell>
                <TableCell>{d.timeEnd}</TableCell>
                <TableCell>{d.centerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default GenerateReport;
