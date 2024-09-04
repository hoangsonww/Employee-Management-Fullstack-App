import { render, screen } from '@testing-library/react';
import DepartmentList from '../components/DepartmentList';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mocking department data
const departments = [
  { id: 1, name: 'IT' },
  { id: 2, name: 'HR' },
];

// Mocking the service
jest.mock('../services/departmentService', () => ({
  getDepartments: jest.fn(() => Promise.resolve(departments)),
}));

test('renders list of departments', async () => {
  render(
    <MemoryRouter>
      <DepartmentList />
    </MemoryRouter>
  );

  // Checking if departments are rendered
  expect(await screen.findByText(/IT/i)).toBeInTheDocument();
  expect(await screen.findByText(/HR/i)).toBeInTheDocument();
});
