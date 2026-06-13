import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/services/departmentService', () => ({
  getAllDepartments: () => new Promise(() => {}),
  getDepartmentById: () => new Promise(() => {}),
  addDepartment: jest.fn(),
  updateDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
}));

import NewDepartmentForm from '../../src/components/NewDepartmentForm';

describe('NewDepartmentForm snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/departments/create']}>
        <NewDepartmentForm />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
