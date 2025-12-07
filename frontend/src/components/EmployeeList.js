import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
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
  Snackbar,
  Alert,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [denseRows, setDenseRows] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setShowSnackbar(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getAllEmployees();
          setEmployees(data);
          const departmentData = await getAllDepartments();
          setDepartments(departmentData);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [isLoggedIn]);

  const handleDelete = async id => {
    setDeletingEmployeeId(id);
    try {
      await deleteEmployee(id);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
    setDeletingEmployeeId(null);
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

  const handleResetFilters = () => {
    setDepartmentFilter('all');
    setAgeFilter('all');
    setSortBy('name');
  };

  const handleExportCsv = () => {
    const header = ['First Name', 'Last Name', 'Email', 'Age', 'Department'];
    const rows = employees.map(emp => [emp.firstName || '', emp.lastName || '', emp.email || '', emp.age || '', emp.department?.name || 'Unassigned']);

    const escapeCell = cell => `"${cell.toString().replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(row => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyEmail = email => {
    if (!email) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    }
  };

  const handleMailTo = email => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch =
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || String(employee.department?.id) === departmentFilter;
      const matchesAge =
        ageFilter === 'all' ||
        (ageFilter === 'under30' && employee.age < 30) ||
        (ageFilter === '30to45' && employee.age >= 30 && employee.age <= 45) ||
        (ageFilter === '45plus' && employee.age > 45);
      return matchesSearch && matchesDepartment && matchesAge;
    })
    .sort((a, b) => {
      if (sortBy === 'age') {
        return (a.age || 0) - (b.age || 0);
      }
      if (sortBy === 'department') {
        return (a.department?.name || 'Unassigned').localeCompare(b.department?.name || 'Unassigned');
      }
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });
  const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalEmployees = employees.length;
  const averageAge = employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (emp.age || 0), 0) / employees.length) : 0;
  const visibleCount = filteredEmployees.length;
  const departmentsCount = departments.length;

  const getInitials = (first, last) => {
    const firstInitial = first?.[0] || '';
    const lastInitial = last?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

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

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Box>
      <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          You must be logged in to access the employee list.{' '}
          <span
            onClick={handleLoginRedirect}
            style={{
              color: '#3f51b5',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => (e.target.style.color = '#f57c00')}
            onMouseLeave={e => (e.target.style.color = '#3f51b5')}
          >
            Login
          </span>
        </Alert>
      </Snackbar>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employees
          </Typography>
          <Typography color="text.secondary">Search, filter, and export your directory without leaving the page.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleExportCsv}
            sx={{
              borderColor: '#1E3C72',
              color: '#1E3C72',
              '&:hover': { backgroundColor: '#1E3C72', color: '#fff', borderColor: '#1E3C72' },
            }}
          >
            Export CSV
          </Button>
          <Button variant="contained" component={Link} to="/add-employee">
            Add Employee
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7ff 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total employees
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {totalEmployees}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across all departments
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fdf2e9 0%, #ffe7d4 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Visible now
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {visibleCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              After filters
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Departments
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {departmentsCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Available for assignment
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e9defa 0%, #fbfcdb 100%)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Avg age
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {averageAge || '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across current roster
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField label="Search by name or email..." variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="department-filter-label">Department</InputLabel>
              <Select
                labelId="department-filter-label"
                value={departmentFilter}
                label="Department"
                onChange={e => {
                  setDepartmentFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All departments</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="age-filter-label">Age</InputLabel>
              <Select
                labelId="age-filter-label"
                value={ageFilter}
                label="Age"
                onChange={e => {
                  setAgeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All ranges</MenuItem>
                <MenuItem value="under30">Under 30</MenuItem>
                <MenuItem value="30to45">30 to 45</MenuItem>
                <MenuItem value="45plus">45+</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="sort-filter-label">Sort by</InputLabel>
              <Select
                labelId="sort-filter-label"
                value={sortBy}
                label="Sort by"
                onChange={e => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="age">Age</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {departmentFilter !== 'all' && (
              <Chip
                label={`Department: ${departments.find(d => String(d.id) === departmentFilter)?.name || 'N/A'}`}
                onDelete={() => setDepartmentFilter('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {ageFilter !== 'all' && (
              <Chip
                label={`Age: ${ageFilter === 'under30' ? 'Under 30' : ageFilter === '30to45' ? '30-45' : '45+'}`}
                onDelete={() => setAgeFilter('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {sortBy !== 'name' && <Chip label={`Sorted by ${sortBy}`} onDelete={() => setSortBy('name')} color="secondary" variant="outlined" />}
            <Button onClick={handleResetFilters} size="small">
              Reset
            </Button>
            <FormControlLabel control={<Switch checked={denseRows} onChange={e => setDenseRows(e.target.checked)} color="primary" />} label="Compact rows" />
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size={denseRows ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f7fb' }}>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 700, letterSpacing: 0.2 }}>Contact</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.length ? (
              paginatedEmployees.map((employee, idx) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fbff',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: '#1E3C72',
                          color: '#fff',
                          width: denseRows ? 30 : 40,
                          height: denseRows ? 30 : 40,
                          fontSize: denseRows ? '0.8rem' : '1rem',
                        }}
                      >
                        {getInitials(employee.firstName, employee.lastName)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>
                          {employee.firstName} {employee.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.department?.name || 'Unassigned'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department?.name || 'Unassigned'}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Email">
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleMailTo(employee.email)}
                            sx={{ minWidth: 36, borderColor: '#1E3C72', color: '#1E3C72', '&:hover': { backgroundColor: '#1E3C72', color: '#fff' } }}
                          >
                            <EmailIcon fontSize="small" />
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Copy email">
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleCopyEmail(employee.email)}
                            sx={{ minWidth: 36, borderColor: '#1E3C72', color: '#1E3C72', '&:hover': { backgroundColor: '#1E3C72', color: '#fff' } }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Button variant="outlined" size="small" component={Link} to={`/edit-employee/${employee.id}`}>
                        Edit
                      </Button>
                      <Tooltip title="This will permanently remove the employee">
                        <span>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deletingEmployeeId === employee.id}
                            startIcon={deletingEmployeeId === employee.id ? <CircularProgress size={16} /> : null}
                          >
                            {deletingEmployeeId === employee.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ textAlign: 'center', padding: '1.5rem' }}>
                    <Typography variant="subtitle1">No employees match your filters.</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try broadening your filters or add a new employee to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default EmployeeList;
