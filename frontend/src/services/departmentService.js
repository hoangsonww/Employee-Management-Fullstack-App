import axios from 'axios';

const API_URL = 'https://employee-management-app-gdm5.onrender.com/api/departments';

// Get all departments
export const getAllDepartments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get department by ID
export const getDepartmentById = async id => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new department
export const addDepartment = async department => {
  const response = await axios.post(API_URL, department);
  return response.data;
};

// Update an existing department
export const updateDepartment = async (id, department) => {
  const response = await axios.put(`${API_URL}/${id}`, department);
  return response.data;
};

// Delete a department
export const deleteDepartment = async id => {
  await axios.delete(`${API_URL}/${id}`);
};
