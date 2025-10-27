import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { Add, Remove, AdminPanelSettings, Security } from '@mui/icons-material';
import { adminService, authService } from '../services/apiService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [actionType, setActionType] = useState('assign'); // 'assign' or 'remove'

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, permissionsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllRoles(),
        adminService.getAllPermissions()
      ]);
      
      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setError('');
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAction = async () => {
    if (!selectedUserId || !selectedRoleName) {
      setError('Please select both user and role');
      return;
    }

    try {
      setLoading(true);
      
      if (actionType === 'assign') {
        await adminService.assignRole(selectedUserId, selectedRoleName, currentUser.userId);
        setSuccess(`Role "${selectedRoleName}" assigned successfully`);
      } else {
        await adminService.removeRole(selectedUserId, selectedRoleName, currentUser.userId);
        setSuccess(`Role "${selectedRoleName}" removed successfully`);
      }
      
      await loadData();
      setAssignDialogOpen(false);
      setSelectedUserId('');
      setSelectedRoleName('');
    } catch (err) {
      console.error('Error in role action:', err);
      setError(`Failed to ${actionType} role. ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAssignDialog = (userId, action) => {
    setSelectedUserId(userId);
    setActionType(action);
    setAssignDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const getRoleColor = (roleName) => {
    const colors = {
      ADMIN: 'error',
      HR: 'warning',
      MANAGER: 'info',
      EMPLOYEE: 'success'
    };
    return colors[roleName] || 'default';
  };

  if (!authService.hasRole('ADMIN') && !authService.hasRole('HR')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. You don't have permission to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AdminPanelSettings color="primary" />
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Roles
              </Typography>
              <Typography variant="h4" color="primary">
                {roles.length}
              </Typography>
              <Typography color="text.secondary">
                Total roles in system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Permissions
              </Typography>
              <Typography variant="h4" color="primary">
                {permissions.length}
              </Typography>
              <Typography color="text.secondary">
                Total permissions available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Users
              </Typography>
              <Typography variant="h4" color="primary">
                {users.length}
              </Typography>
              <Typography color="text.secondary">
                Total users registered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users and Roles Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            User Role Management
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User ID</strong></TableCell>
                    <TableCell><strong>Username</strong></TableCell>
                    <TableCell><strong>Roles</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Chip
                                key={role.id}
                                label={role.name}
                                color={getRoleColor(role.name)}
                                size="small"
                              />
                            ))
                          ) : (
                            <Chip label="No roles" color="default" size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Assign Role">
                            <IconButton 
                              color="success" 
                              onClick={() => openAssignDialog(user.id, 'assign')}
                              size="small"
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Role">
                            <IconButton 
                              color="error" 
                              onClick={() => openAssignDialog(user.id, 'remove')}
                              size="small"
                              disabled={!user.roles || user.roles.length === 0}
                            >
                              <Remove />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'assign' ? 'Assign Role' : 'Remove Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRoleName}
                onChange={(e) => setSelectedRoleName(e.target.value)}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name} - {role.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRoleAction} 
            variant="contained" 
            color={actionType === 'assign' ? 'primary' : 'error'}
          >
            {actionType === 'assign' ? 'Assign' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;