// __tests__/DepartmentList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DepartmentList from '../src/components/DepartmentList';
import * as deptService from '../src/services/departmentService';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// stub out useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// spy on service methods
jest.spyOn(deptService, 'getAllDepartments');
jest.spyOn(deptService, 'deleteDepartment');

describe('<DepartmentList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('shows warning snackbar when not logged in', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/departments']}>
          <DepartmentList />
        </MemoryRouter>
      );
    });

    // snackbar text and login link
    expect(screen.getByText(/You must be logged in to access the department list/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/^Login$/));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('fetches and renders departments when logged in', async () => {
    localStorage.setItem('token', 'abc');
    const fakeDepts = [
      { id: '1', name: 'HR' },
      { id: '2', name: 'IT' },
    ];
    deptService.getAllDepartments.mockResolvedValue(fakeDepts);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/departments']}>
          <Routes>
            <Route path="/departments" element={<DepartmentList />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // wait for departments to appear
    expect(await screen.findByText('HR')).toBeInTheDocument();
    expect(await screen.findByText('IT')).toBeInTheDocument();
  });

  it('deletes a department when Delete is clicked', async () => {
    localStorage.setItem('token', 't');
    const fakeDepts = [
      { id: '1', name: 'Finance' },
      { id: '2', name: 'Legal' },
    ];
    deptService.getAllDepartments.mockResolvedValue(fakeDepts);
    deptService.deleteDepartment.mockResolvedValue();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/departments']}>
          <DepartmentList />
        </MemoryRouter>
      );
    });

    // ensure Finance is rendered
    expect(await screen.findByText('Finance')).toBeInTheDocument();

    const deleteBtns = screen.getAllByRole('button', { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteBtns[0]);
    });

    // after deletion, Finance should be gone
    expect(screen.queryByText('Finance')).toBeNull();
    // Legal remains
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });
});
