// __tests__/Profile.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Profile from '../src/components/Profile';
import * as empService from '../src/services/employeeService';
import * as deptService from '../src/services/departmentService';
import { MemoryRouter } from 'react-router-dom';

// Mock navigation
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: jest.fn() };
});

describe('<Profile />', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  it('logs out and redirects on Logout click', async () => {
    // Simulate a logged-in user
    localStorage.setItem('token', 'tok');
    localStorage.setItem('EMSusername', 'Bob');
    jest.spyOn(empService, 'getAllEmployees').mockResolvedValue([{ age: 30 }]);
    jest.spyOn(deptService, 'getAllDepartments').mockResolvedValue([{}]);

    render(
      <MemoryRouter>
        <Profile theme="light" />
      </MemoryRouter>
    );

    // Wait for loading spinner to disappear
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeNull(), { timeout: 5000 });

    // Wait for Logout button to appear
    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
