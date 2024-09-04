import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeForm from '../components/EmployeeForm';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mocking employee data
const employee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

// Mocking the service
jest.mock('../services/employeeService', () => ({
  getEmployeeById: jest.fn(() => Promise.resolve(employee)),
  saveEmployee: jest.fn(() => Promise.resolve(employee)),
}));

test('renders employee form for editing', async () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue(/John/i)).toBeInTheDocument();
});

test('submits the form', async () => {
  render(
    <MemoryRouter>
      <EmployeeForm />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
  fireEvent.click(screen.getByText(/Save/i));

  expect(await screen.findByDisplayValue(/Jane/i)).toBeInTheDocument();
});
