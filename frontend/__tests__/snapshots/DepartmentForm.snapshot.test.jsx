import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../../src/services/departmentService', () => ({
  getAllDepartments: () => new Promise(() => {}),
  getDepartmentById: () => new Promise(() => {}),
  addDepartment: jest.fn(),
  updateDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
}));

import DepartmentForm from '../../src/components/DepartmentForm';

describe('DepartmentForm snapshot', () => {
  it('matches the rendered markup (add mode)', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/departments/new']}>
        <Routes>
          <Route path="/departments/new" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
