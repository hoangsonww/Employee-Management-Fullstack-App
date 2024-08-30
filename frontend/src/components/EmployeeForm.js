import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addEmployee, getEmployeeById, updateEmployee } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import { TextField, Button, MenuItem, Box } from '@mui/material';

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({ firstName: '', lastName: '', email: '', department: { id: '' } });
  const [departments, setDepartments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
      if (id) {
        const employeeData = await getEmployeeById(id);
        setEmployee(employeeData);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateEmployee(id, employee);
    } else {
      await addEmployee(employee);
    }
    navigate('/employees');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' } }}>
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <TextField label="First Name" name="firstName" value={employee.firstName} onChange={handleChange} required />
      <TextField label="Last Name" name="lastName" value={employee.lastName} onChange={handleChange} required />
      <TextField label="Email" name="email" type="email" value={employee.email} onChange={handleChange} required />
      <TextField
        select
        label="Department"
        name="department.id"
        value={employee.department.id}
        onChange={handleChange}
        required
      >
        <MenuItem value="">Select Department</MenuItem>
        {departments.map((department) => (
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
