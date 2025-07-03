// __tests__/EmployeeList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EmployeeList from '../src/components/EmployeeList';
import * as empService from '../src/services/employeeService';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// spy on service functions
jest.spyOn(empService, 'getAllEmployees');
jest.spyOn(empService, 'deleteEmployee');

describe('<EmployeeList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('shows warning snackbar when not logged in and redirects on Login click', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/employees']}>
          <EmployeeList />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/You must be logged in to access the employee list/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/^Login$/));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('fetches and renders employees when logged in', async () => {
    localStorage.setItem('token', 'token123');
    const fakeEmps = [
      { id: 'e1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { id: 'e2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    ];
    empService.getAllEmployees.mockResolvedValue(fakeEmps);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/employees']}>
          <Routes>
            <Route path="/employees" element={<EmployeeList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // ensure both rows appear
    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('deletes an employee when Delete is clicked', async () => {
    localStorage.setItem('token', 't');
    const fakeEmps = [
      { id: 'e1', firstName: 'Alice', lastName: 'Blue', email: 'alice@x.com' },
      { id: 'e2', firstName: 'Bob', lastName: 'Green', email: 'bob@x.com' },
    ];
    empService.getAllEmployees.mockResolvedValue(fakeEmps);
    empService.deleteEmployee.mockResolvedValue();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/employees']}>
          <EmployeeList />
        </MemoryRouter>
      );
    });

    // wait until Alice shows up
    expect(await screen.findByText('Alice')).toBeInTheDocument();

    // click the first Delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    // Alice should be removed
    expect(screen.queryByText('Alice')).toBeNull();
    // Bob remains
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
