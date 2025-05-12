
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApi from '../../service/ApiHook';

const UpdateVaccinationStatus = () => {
  const [recordId, setRecordId] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [vaccineId, setVaccineId] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const api = useApi();

  const handleUpdate = async () => {
    try {
      const payload = {
        registration: { registrationId },
        vaccineInfo: { vaccineId },
        status,
      };
  
      const endpoint = recordId ? `/vaccination-status/${recordId}` : '/vaccination-status';
  
      const response = recordId
        ? await api.put(endpoint, payload)
        : await api.post(endpoint, payload);
  
      setMessage('Vaccination status successfully ' + (recordId ? 'updated' : 'created'));
    } catch (error) {
      console.error(error);
      setMessage('Failed to update vaccination status');
    }
  };

  return (
    <Box component={Paper} p={3} m={2}>
      <Typography variant="h6">Update Vaccination Status</Typography>
      <TextField
        label="Record ID (for update only)"
        value={recordId}
        onChange={(e) => setRecordId(e.target.value)}
        fullWidth margin="normal"
      />
      <TextField
        label="Registration ID"
        value={registrationId}
        onChange={(e) => setRegistrationId(e.target.value)}
        fullWidth margin="normal"
      />
      <TextField
        label="Vaccine ID"
        value={vaccineId}
        onChange={(e) => setVaccineId(e.target.value)}
        fullWidth margin="normal"
      />
      <TextField
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Submit
      </Button>
      {message && <Typography mt={2}>{message}</Typography>}
    </Box>
  );
};

export default UpdateVaccinationStatus;
