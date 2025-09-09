import axios from 'axios';

// Use environment variable for API URL or fallback to hardcoded
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://employee-management-app-gdm5.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('EMSusername');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/authenticate', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        userId: response.data.userId,
        roles: response.data.roles
      }));
      localStorage.setItem('EMSusername', response.data.username);
    }
    
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('EMSusername');
  },

  // Get current user info
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user has specific role
  hasRole: (roleName) => {
    const user = authService.getCurrentUser();
    return user && user.roles && user.roles.includes(roleName);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Admin services
export const adminService = {
  // Get all users with roles
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  // Get all roles
  getAllRoles: async () => {
    const response = await api.get('/api/admin/roles');
    return response.data;
  },

  // Get all permissions
  getAllPermissions: async () => {
    const response = await api.get('/api/admin/permissions');
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId, roleName, actorUserId) => {
    const response = await api.post('/api/admin/users/assign-role', {
      userId,
      roleName,
      actorUserId
    });
    return response.data;
  },

  // Remove role from user
  removeRole: async (userId, roleName, actorUserId) => {
    const response = await api.post('/api/admin/users/remove-role', {
      userId,
      roleName,
      actorUserId
    });
    return response.data;
  },

  // Get audit logs with filtering
  getAuditLogs: async (filters = {}, page = 0, size = 20, sort = 'timestamp,desc') => {
    const params = new URLSearchParams({
      page,
      size,
      sort,
      ...filters
    });
    
    const response = await api.get(`/api/admin/audit-logs?${params}`);
    return response.data;
  }
};

// Employee services (updated with authentication)
export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    const response = await api.get('/api/employees');
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  // Add a new employee
  addEmployee: async (employee) => {
    const response = await api.post('/api/employees', employee);
    return response.data;
  },

  // Update an existing employee
  updateEmployee: async (id, employee) => {
    const response = await api.put(`/api/employees/${id}`, employee);
    return response.data;
  },

  // Delete an employee
  deleteEmployee: async (id) => {
    await api.delete(`/api/employees/${id}`);
  }
};

// Department services (updated with authentication)
export const departmentService = {
  // Get all departments
  getAllDepartments: async () => {
    const response = await api.get('/api/departments');
    return response.data;
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    const response = await api.get(`/api/departments/${id}`);
    return response.data;
  },

  // Add a new department
  addDepartment: async (department) => {
    const response = await api.post('/api/departments', department);
    return response.data;
  },

  // Update an existing department
  updateDepartment: async (id, department) => {
    const response = await api.put(`/api/departments/${id}`, department);
    return response.data;
  },

  // Delete a department
  deleteDepartment: async (id) => {
    await api.delete(`/api/departments/${id}`);
  }
};

export default api;