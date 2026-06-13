import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Charts need a real canvas/GPU; stub them so the snapshot is deterministic.
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Pie: () => <div data-testid="pie-chart" />,
  Line: () => <div data-testid="line-chart" />,
}));

// Keep data fetches pending so the page renders its deterministic loading
// state with no network and no async act races.
jest.mock('../../src/services/employeeService', () => ({
  getAllEmployees: () => new Promise(() => {}),
  getEmployeeById: () => new Promise(() => {}),
  addEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
}));
jest.mock('../../src/services/departmentService', () => ({
  getAllDepartments: () => new Promise(() => {}),
  getDepartmentById: () => new Promise(() => {}),
  addDepartment: jest.fn(),
  updateDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
}));
jest.mock('../../src/services/authService', () => ({
  getToken: () => null,
  getUsername: () => '',
  isAuthenticated: () => false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  subscribeAuth: () => () => {},
}));

import Dashboard from '../../src/components/Dashboard';

describe('Dashboard snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
