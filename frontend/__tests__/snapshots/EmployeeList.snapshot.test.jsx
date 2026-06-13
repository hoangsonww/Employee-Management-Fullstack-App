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

import EmployeeList from '../../src/components/EmployeeList';

describe('EmployeeList snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/employees']}>
        <EmployeeList />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
