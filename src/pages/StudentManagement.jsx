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
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useApi from '../service/ApiHook';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    rollNumber: '',
    className: '',
    section: '',
    gender: '',
    contactNumber: '',
    address: '',
    email: ''
  });

  const api = useApi();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students?page=0&size=100');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/students/${editId}`, form);
      } else {
        await api.post('/students', [form]);
      }
      setOpenDialog(false);
      setForm({
        firstName: '', middleName: '', lastName: '', dateOfBirth: '',
        rollNumber: '', className: '', section: '', gender: '',
        contactNumber: '', address: '', email: ''
      });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      setError('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditId(student.studentId);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.del(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student');
    }
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
        Student Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenDialog(true)}>
        Add Student
      </Button>

      <Paper sx={{ padding: 2, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.firstName} {student.middleName} {student.lastName}</TableCell>
                <TableCell>{student.dateOfBirth}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.contactNumber}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(student.studentId)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Student</DialogTitle>
        <DialogContent>
          {['firstName', 'middleName', 'lastName', 'dateOfBirth', 'rollNumber', 'className', 'section', 'gender', 'contactNumber', 'address', 'email'].map(field => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.replace(/([A-Z])/g, ' $1')}
              type={field === 'dateOfBirth' ? 'date' : 'text'}
              fullWidth
              InputLabelProps={field === 'dateOfBirth' ? { shrink: true } : undefined}
              value={form[field] || ''}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentManagement;
