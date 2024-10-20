import axios from 'axios';

const API_URL = 'https://employee-management-app-gdm5.onrender.com/api/employees';

// Get all employees
export const getAllEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get employee by ID
export const getEmployeeById = async id => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new employee
export const addEmployee = async employee => {
  const response = await axios.post(API_URL, employee);
  return response.data;
};

// Update an existing employee
export const updateEmployee = async (id, employee) => {
  const response = await axios.put(`${API_URL}/${id}`, employee);
  return response.data;
};

// Delete an employee
export const deleteEmployee = async id => {
  await axios.delete(`${API_URL}/${id}`);
};
