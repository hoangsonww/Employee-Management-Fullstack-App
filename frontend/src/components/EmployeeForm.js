import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addEmployee, getEmployeeById, updateEmployee } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import { TextField, Button, MenuItem, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const CenteredSpinner = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    department: { id: '' },
  });
  const [departments, setDepartments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);

        if (id) {
          const employeeData = await getEmployeeById(id);
          if (employeeData) {
            setEmployee({
              firstName: employeeData.firstName || '',
              lastName: employeeData.lastName || '',
              email: employeeData.email || '',
              age: employeeData.age || '',
              department: {
                id: employeeData.department ? employeeData.department.id : '',
              },
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'department.id') {
      setEmployee({ ...employee, department: { id: value } });
    } else {
      setEmployee({
        ...employee,
        [name]: name === 'age' ? Number(value) : value, // Convert age to number
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        await updateEmployee(id, employee);
      } else {
        await addEmployee(employee);
      }
      setIsLoading(false);
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <CenteredSpinner>
        <CircularProgress />
      </CenteredSpinner>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' } }}>
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <TextField label="First Name" name="firstName" value={employee.firstName} onChange={handleChange} required />
      <TextField label="Last Name" name="lastName" value={employee.lastName} onChange={handleChange} required />
      <TextField label="Email" name="email" type="email" value={employee.email} onChange={handleChange} required />
      <TextField label="Age" name="age" type="number" value={employee.age} onChange={handleChange} required inputProps={{ min: 1, max: 150 }} />
      <TextField select label="Department" name="department.id" value={employee.department.id || ''} onChange={handleChange} required>
        <MenuItem value="">Select Department</MenuItem>
        {departments.map(department => (
          <MenuItem key={department.id} value={department.id}>
            {department.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
        Save
      </Button>
    </Box>
  );
};

export default EmployeeForm;
