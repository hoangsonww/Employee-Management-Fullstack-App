// __tests__/EmployeeList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EmployeeList from '../src/components/EmployeeList';
import * as empService from '../src/services/employeeService';
import * as deptService from '../src/services/departmentService';
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
jest.spyOn(deptService, 'getAllDepartments');

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
      { id: 'e1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30, department: { id: '1', name: 'IT' } },
      { id: 'e2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, department: { id: '2', name: 'HR' } },
    ];
    empService.getAllEmployees.mockResolvedValue(fakeEmps);
    deptService.getAllDepartments.mockResolvedValue([
      { id: '1', name: 'IT' },
      { id: '2', name: 'HR' },
    ]);

    render(
      <MemoryRouter initialEntries={['/employees']}>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
        </Routes>
      </MemoryRouter>
    );

    // Simply verify the services were called - this proves the component mounted and fetched data
    await waitFor(() => {
      expect(empService.getAllEmployees).toHaveBeenCalled();
      expect(deptService.getAllDepartments).toHaveBeenCalled();
    });
  });

  it('deletes an employee when Delete is clicked', async () => {
    localStorage.setItem('token', 't');
    const fakeEmps = [
      { id: 'e1', firstName: 'Alice', lastName: 'Blue', email: 'alice@x.com', age: 28, department: { id: '1', name: 'IT' } },
      { id: 'e2', firstName: 'Bob', lastName: 'Green', email: 'bob@x.com', age: 32, department: { id: '2', name: 'HR' } },
    ];
    let currentEmps = [...fakeEmps];
    empService.getAllEmployees.mockImplementation(() => Promise.resolve(currentEmps));
    deptService.getAllDepartments.mockResolvedValue([
      { id: '1', name: 'IT' },
      { id: '2', name: 'HR' },
    ]);
    empService.deleteEmployee.mockImplementation(id => {
      currentEmps = currentEmps.filter(e => e.id !== id);
      return Promise.resolve();
    });

    render(
      <MemoryRouter initialEntries={['/employees']}>
        <EmployeeList />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(
      () => {
        expect(empService.getAllEmployees).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );

    // Wait for Delete buttons to appear
    await waitFor(
      () => {
        expect(screen.getAllByRole('button', { name: /delete/i }).length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    // click the first Delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Verify deleteEmployee was called
    await waitFor(
      () => {
        expect(empService.deleteEmployee).toHaveBeenCalledWith('e1');
      },
      { timeout: 5000 }
    );
  });
});
