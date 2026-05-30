import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDepartment, getDepartmentById, updateDepartment } from '../services/departmentService';
import { TextField, Button, CircularProgress, Box } from '@mui/material';
import { notifySuccess, notifyApiError } from '../utils/toast';

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
          notifyApiError(error, 'We could not load this department. Please refresh and try again.');
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
      notifySuccess(`Department "${department.name}" was ${id ? 'updated' : 'created'} successfully.`);
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      setIsLoading(false); // Stop loading
      notifyApiError(error, `We could not ${id ? 'update' : 'create'} this department. Please try again.`);
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
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 260px)' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' }, maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        <h2>{id ? 'Edit Department' : 'Add Department'}</h2>
        <TextField label="Department Name" name="name" value={department.name} onChange={handleChange} required fullWidth />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DepartmentForm;
