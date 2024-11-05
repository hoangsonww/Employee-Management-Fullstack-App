import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDepartments, deleteDepartment } from '../services/departmentService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllDepartments();
      setDepartments(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async id => {
    setDeletingDepartmentId(id);
    try {
      await deleteDepartment(id);
      setDepartments(prevDepartments => prevDepartments.filter(department => department.id !== id));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
    setDeletingDepartmentId(null);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page to 0 whenever search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const filteredDepartments = departments.filter(department => department.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <h2>Departments</h2>
      <Button variant="contained" component={Link} to="/add-department" sx={{ marginBottom: '1rem' }}>
        Add Department
      </Button>
      <TextField
        label="Search for a department"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: '1rem', width: '100%' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(department => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/edit-department/${department.id}`}
                    sx={{ marginRight: '0.5rem', marginBottom: '0.25rem' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(department.id)}
                    sx={{ marginBottom: '0.25rem' }}
                    disabled={deletingDepartmentId === department.id}
                    startIcon={deletingDepartmentId === department.id ? <CircularProgress size={20} /> : null}
                  >
                    {deletingDepartmentId === department.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDepartments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DepartmentList;
