import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeList from '../components/EmployeeList';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mocking employee data
const employees = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
];

// Mocking the service
jest.mock('../services/employeeService', () => ({
  getEmployees: jest.fn(() => Promise.resolve(employees)),
}));

test('renders list of employees', async () => {
  render(
    <MemoryRouter>
      <EmployeeList />
    </MemoryRouter>
  );

  // Checking if employees are rendered
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
  expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
});

test('navigates to EmployeeForm when "Add Employee" is clicked', () => {
  render(
    <MemoryRouter>
      <EmployeeList />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/Add Employee/i));
});
