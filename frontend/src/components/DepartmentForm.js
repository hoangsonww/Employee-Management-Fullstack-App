import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDepartment, getDepartmentById, updateDepartment } from '../services/departmentService';
import { TextField, Button, CircularProgress, Box } from '@mui/material'; // Import necessary MUI components

const DepartmentForm = () => {
  const [department, setDepartment] = useState({ name: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true); // Start loading
        try {
          const departmentData = await getDepartmentById(id);
          setDepartment(departmentData);
        } catch (error) {
          console.error('Error fetching department data:', error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      if (id) {
        await updateDepartment(id, department);
      } else {
        await addDepartment(department);
      }
      setIsLoading(false); // Stop loading
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      setIsLoading(false); // Stop loading
    }
  };

  // If loading, show centered spinner
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' }, maxWidth: '400px', margin: '0 auto' }}>
      <h2>{id ? 'Edit Department' : 'Add Department'}</h2>
      <TextField label="Department Name" name="name" value={department.name} onChange={handleChange} required fullWidth />
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
        Save
      </Button>
    </Box>
  );
};

export default DepartmentForm;
