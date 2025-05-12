import { Container, Paper, Typography } from '@mui/material';
import React from 'react';


const DriveManagement = () => {
  return (
    <Container sx={{ mt: 4 }}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">Manage Vaccination Drives</Typography>
      <Typography>CRUD operations and drive validations will go here</Typography>
    </Paper>
  </Container>
  )
}

export default DriveManagement