import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

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

import EmployeeForm from '../../src/components/EmployeeForm';

describe('EmployeeForm snapshot', () => {
  it('matches the rendered markup (add mode)', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/employees/new']}>
        <Routes>
          <Route path="/employees/new" element={<EmployeeForm />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
