import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/Dashboard';
import { getAllEmployees } from '../src/services/employeeService';
import { getAllDepartments } from '../src/services/departmentService';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Pie: () => <div data-testid="pie-chart" />,
  Line: () => <div data-testid="line-chart" />,
}));
jest.mock('../src/services/employeeService');
jest.mock('../src/services/departmentService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<Dashboard />', () => {
  beforeEach(() => {
    getAllEmployees.mockResolvedValue([{ age: 30 }, { age: 40 }, { age: 50 }]);
    getAllDepartments.mockResolvedValue([{}, {}]);
  });

  it('shows a loading spinner, then the overview and charts', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await screen.findByText(/overview dashboard/i);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('40.0')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('pie-chart').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('line-chart').length).toBeGreaterThan(0);
  });
});
