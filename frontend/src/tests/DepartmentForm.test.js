import { render, screen, fireEvent } from '@testing-library/react';
import DepartmentForm from '../components/DepartmentForm';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mocking department data
const department = { id: 1, name: 'IT' };

// Mocking the service
jest.mock('../services/departmentService', () => ({
  getDepartmentById: jest.fn(() => Promise.resolve(department)),
  saveDepartment: jest.fn(() => Promise.resolve(department)),
}));

test('renders department form for editing', async () => {
  render(
    <MemoryRouter>
      <DepartmentForm />
    </MemoryRouter>
  );

  expect(await screen.findByDisplayValue(/IT/i)).toBeInTheDocument();
});

test('submits the form', async () => {
  render(
    <MemoryRouter>
      <DepartmentForm />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/Department Name/i), { target: { value: 'HR' } });
  fireEvent.click(screen.getByText(/Save/i));

  expect(await screen.findByDisplayValue(/HR/i)).toBeInTheDocument();
});
