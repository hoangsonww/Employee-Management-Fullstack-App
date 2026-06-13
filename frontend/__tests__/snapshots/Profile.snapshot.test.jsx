import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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

import Profile from '../../src/components/Profile';

describe('Profile snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
