import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Box } from '@mui/material';

const NewDepartmentForm = () => {
  const [department, setDepartment] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input change for department name
  const handleChange = e => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  // Handle form submission to create a new department
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true); // Start loading spinner
    setError(null); // Reset any previous error

    const newDepartment = {
      // generate random id from 0-9999
      id: Math.floor(Math.random() * 10000),
      name: department.name,
      employees: [], // Empty array for employees
    };

    try {
      const response = await fetch('https://employee-management-app-gdm5.onrender.com/api/departments', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartment), // Send the new department data as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to create department');
      }

      // Navigate to the departments list after successful creation
      navigate('/departments');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create department. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' }, maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create New Department</h2>
      <TextField label="Department Name" name="name" value={department.name} onChange={handleChange} required fullWidth />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Save'}
      </Button>
    </Box>
  );
};

export default NewDepartmentForm;
