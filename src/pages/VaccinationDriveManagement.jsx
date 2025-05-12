import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useApi from '../service/ApiHook';

const VaccinationDriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('asc');
  const [form, setForm] = useState({
    date: '',
    timeStart: '',
    timeEnd: '',
    slotsAvailable: '',
    vaccinationCenterId: '',
    vaccineInfoId: ''
  });

  const api = useApi();

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/schedules?page=0&size=100');
      setDrives(res.data);
    } catch (err) {
      setError('Failed to load vaccination drives');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date: form.date,
        timeStart: form.timeStart,
        timeEnd: form.timeEnd,
        slotsAvailable: parseInt(form.slotsAvailable, 10),
        vaccinationCenter: { centerId: parseInt(form.vaccinationCenterId, 10) },
        vaccineInfo: { vaccineId: parseInt(form.vaccineInfoId, 10) }
      };

      if (editId) {
        await api.put(`/schedules/${editId}`, payload);
      } else {
        await api.post('/schedules', [payload]);
      }

      setOpenDialog(false);
      setForm({ date: '', timeStart: '', timeEnd: '', slotsAvailable: '', vaccinationCenterId: '', vaccineInfoId: '' });
      setEditId(null);
      fetchDrives();
    } catch (err) {
      setError('Failed to save drive');
    }
  };

  const handleEdit = (drive) => {
    setForm({
      date: drive.date,
      timeStart: drive.timeStart,
      timeEnd: drive.timeEnd,
      slotsAvailable: drive.slotsAvailable,
      vaccinationCenterId: drive.vaccinationCenter?.centerId || '',
      vaccineInfoId: drive.vaccineInfo?.vaccineId || ''
    });
    setEditId(drive.scheduleId);
    setOpenDialog(true);
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
    setShowConfirmDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await api.del(`/schedules/${confirmDeleteId}`);
      setShowConfirmDialog(false);
      setConfirmDeleteId(null);
      fetchDrives();
    } catch (err) {
      setError('Failed to delete drive');
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sorted = [...drives].sort((a, b) => {
      const valA = a[property];
      const valB = b[property];
      return (isAsc ? valA > valB : valA < valB) ? 1 : -1;
    });
    setDrives(sorted);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vaccination Drive Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenDialog(true)}>
        Add Vaccination Drive
      </Button>

      <Paper sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['date', 'timeStart', 'timeEnd', 'slotsAvailable'].map((col) => (
                <TableCell key={col} sortDirection={orderBy === col ? order : false}>
                  <TableSortLabel active={orderBy === col} direction={orderBy === col ? order : 'asc'} onClick={() => handleSort(col)}>
                    {col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1')}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Center Name</TableCell>
              <TableCell>Vaccine Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drives.map((drive) => (
              <TableRow key={drive.scheduleId}>
                <TableCell>{drive.date}</TableCell>
                <TableCell>{drive.timeStart}</TableCell>
                <TableCell>{drive.timeEnd}</TableCell>
                <TableCell>{drive.slotsAvailable}</TableCell>
                <TableCell>{drive.vaccinationCenter?.vaccinationCenter || 'Unknown'}</TableCell>
                <TableCell>{drive.vaccineInfo?.vaccineName || 'Unknown'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton onClick={() => handleEdit(drive)}><EditIcon /></IconButton>
                  <IconButton onClick={() => confirmDelete(drive.scheduleId)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Vaccination Drive</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="date" label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange} />
          <TextField margin="dense" name="timeStart" label="Start Time" type="time" fullWidth InputLabelProps={{ shrink: true }} value={form.timeStart} onChange={handleChange} />
          <TextField margin="dense" name="timeEnd" label="End Time" type="time" fullWidth InputLabelProps={{ shrink: true }} value={form.timeEnd} onChange={handleChange} />
          <TextField margin="dense" name="slotsAvailable" label="Slots Available" type="number" fullWidth value={form.slotsAvailable} onChange={handleChange} />
          <TextField margin="dense" name="vaccinationCenterId" label="Center ID" type="number" fullWidth value={form.vaccinationCenterId} onChange={handleChange} />
          <TextField margin="dense" name="vaccineInfoId" label="Vaccine ID" type="number" fullWidth value={form.vaccineInfoId} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    Are you sure you want to delete this vaccination drive?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
    <Button color="error" onClick={handleConfirmDelete} variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default VaccinationDriveManagement;
