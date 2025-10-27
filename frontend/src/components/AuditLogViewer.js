import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, Button,
  Grid, FormControl, InputLabel, Select, MenuItem, Chip, Pagination,
  Alert, CircularProgress, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent
} from '@mui/material';
import { History, FilterList, Visibility } from '@mui/icons-material';
import { adminService, authService } from '../services/apiService';

const AuditLogViewer = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Filter states
  const [filters, setFilters] = useState({
    actorUserId: '',
    action: '',
    resourceType: '',
    startDate: null,
    endDate: null
  });
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Common actions and resource types for dropdowns
  const commonActions = [
    'USER_LOGIN', 'USER_REGISTER', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE',
    'CREATE_DEPARTMENT', 'UPDATE_DEPARTMENT', 'DELETE_DEPARTMENT', 'ASSIGN_ROLE', 'REMOVE_ROLE'
  ];
  
  const commonResourceTypes = ['USER', 'EMPLOYEE', 'DEPARTMENT', 'AUTH'];

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      
      // Prepare filters for API
      const apiFilters = {};
      if (filters.actorUserId) apiFilters.actorUserId = filters.actorUserId;
      if (filters.action) apiFilters.action = filters.action;
      if (filters.resourceType) apiFilters.resourceType = filters.resourceType;
      if (filters.startDate) apiFilters.startDate = filters.startDate.toISOString();
      if (filters.endDate) apiFilters.endDate = filters.endDate.toISOString();

      const response = await adminService.getAuditLogs(
        apiFilters,
        currentPage - 1, // API uses 0-based indexing
        pageSize,
        'timestamp,desc'
      );
      
      setAuditLogs(response.content);
      setTotalPages(response.totalPages);
      setError('');
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadAuditLogs();
  };

  const clearFilters = () => {
    setFilters({
      actorUserId: '',
      action: '',
      resourceType: '',
      startDate: null,
      endDate: null
    });
    setCurrentPage(1);
  };

  const openDetailsDialog = (log) => {
    setSelectedLog(log);
    setDetailsDialogOpen(true);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionColor = (action) => {
    const colors = {
      USER_LOGIN: 'info',
      USER_REGISTER: 'success',
      CREATE_EMPLOYEE: 'success',
      UPDATE_EMPLOYEE: 'warning',
      DELETE_EMPLOYEE: 'error',
      CREATE_DEPARTMENT: 'success',
      UPDATE_DEPARTMENT: 'warning',
      DELETE_DEPARTMENT: 'error',
      ASSIGN_ROLE: 'info',
      REMOVE_ROLE: 'warning'
    };
    return colors[action] || 'default';
  };

  if (!authService.hasRole('ADMIN') && !authService.hasRole('HR')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. You don't have permission to view audit logs.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <History color="primary" />
        Audit Log Viewer
      </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Filters Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              Filters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="User ID"
                  type="number"
                  value={filters.actorUserId}
                  onChange={(e) => handleFilterChange('actorUserId', e.target.value)}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={filters.action}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    label="Action"
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    {commonActions.map((action) => (
                      <MenuItem key={action} value={action}>{action}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Resource Type</InputLabel>
                  <Select
                    value={filters.resourceType}
                    onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                    label="Resource Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {commonResourceTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="datetime-local"
                  value={filters.startDate ? filters.startDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="datetime-local"
                  value={filters.endDate ? filters.endDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : null)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={applyFilters} size="small">
                    Apply
                  </Button>
                  <Button variant="outlined" onClick={clearFilters} size="small">
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Timestamp</strong></TableCell>
                        <TableCell><strong>User ID</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                        <TableCell><strong>Resource</strong></TableCell>
                        <TableCell><strong>Resource ID</strong></TableCell>
                        <TableCell><strong>IP Address</strong></TableCell>
                        <TableCell><strong>Impersonated</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                          <TableCell>{log.actorUserId}</TableCell>
                          <TableCell>
                            <Chip 
                              label={log.action} 
                              color={getActionColor(log.action)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{log.resourceType}</TableCell>
                          <TableCell>{log.resourceId || 'N/A'}</TableCell>
                          <TableCell>{log.ip || 'N/A'}</TableCell>
                          <TableCell>
                            {log.impersonated ? (
                              <Chip label="Yes" color="warning" size="small" />
                            ) : (
                              <Chip label="No" color="default" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => openDetailsDialog(log)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog 
          open={detailsDialogOpen} 
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogContent>
            {selectedLog && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Timestamp:</Typography>
                    <Typography>{formatTimestamp(selectedLog.timestamp)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">User ID:</Typography>
                    <Typography>{selectedLog.actorUserId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Action:</Typography>
                    <Typography>{selectedLog.action}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Resource Type:</Typography>
                    <Typography>{selectedLog.resourceType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Resource ID:</Typography>
                    <Typography>{selectedLog.resourceId || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">IP Address:</Typography>
                    <Typography>{selectedLog.ip || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">User Agent:</Typography>
                    <Typography sx={{ wordBreak: 'break-all' }}>
                      {selectedLog.userAgent || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Details:</Typography>
                    <Paper sx={{ p: 1, backgroundColor: 'grey.50', mt: 1 }}>
                      <Typography component="pre" sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                        {selectedLog.details || 'No additional details'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Impersonated:</Typography>
                    <Typography>{selectedLog.impersonated ? 'Yes' : 'No'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  
  export default AuditLogViewer;