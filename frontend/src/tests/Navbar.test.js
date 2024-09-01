import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

test('renders navbar with links', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Employees/i)).toBeInTheDocument();
  expect(screen.getByText(/Departments/i)).toBeInTheDocument();
});
