import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDepartments, deleteDepartment } from '../services/departmentService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, TextField, Box } from '@mui/material';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllDepartments();
      setDepartments(data);
    };
    fetchData();
  }, []);

  const handleDelete = async id => {
    await deleteDepartment(id);
    setDepartments(departments.filter(department => department.id !== id));
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDepartments = departments.filter(department => department.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box>
      <h2>Departments</h2>
      <Button variant="contained" component={Link} to="/add-department" sx={{ marginBottom: '1rem' }}>
        Add Department
      </Button>
      <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearchChange} sx={{ marginBottom: '1rem', width: '100%' }} />
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
                  <Button variant="contained" color="primary" component={Link} to={`/edit-department/${department.id}`} sx={{ marginRight: '0.5rem' }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(department.id)}>
                    Delete
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
