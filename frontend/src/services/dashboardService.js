import axios from 'axios';

const API_URL = 'https://employee-management-app-gdm5.onrender.com/api/analytics/employees-by-department';

// Get employee count by department
export const getEmployeesByDepartment = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};


