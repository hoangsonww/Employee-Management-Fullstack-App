import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import '@testing-library/jest-dom/extend-expect';

test('renders dashboard with metrics', () => {
  render(<Dashboard />);

  expect(screen.getByText(/Total Employees/i)).toBeInTheDocument();
  expect(screen.getByText(/Employee Growth Over Time/i)).toBeInTheDocument();
  expect(screen.getByText(/Average Age of Employees/i)).toBeInTheDocument();
});
