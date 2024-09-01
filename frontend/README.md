# Employee Management System - Frontend

## Overview

The Employee Management System frontend is a **React-based** application that provides a user interface for managing employee and department data. The app includes features for viewing, adding, editing, and deleting employees and departments. It also includes visualizations for employee metrics such as growth over time and distribution by age range.

## File Structure

Here's a high-level overview of the file structure:

```
employee-management-app
│
├── docker-compose.yaml
│
├── backend
│   └── (Backend code)
│
└── frontend
    ├── build
    ├── public
    │   ├── index.html
    │   └── favicon.ico
    │   └── manifest.json
    │   └── robots.txt
    │   └── icon-192x192.webp
    │   └── icon-512x512.webp
    ├── src
    │   ├── components
    │   │   ├── Dashboard.js
    │   │   ├── EmployeeList.js
    │   │   ├── EmployeeForm.js
    │   │   ├── DepartmentList.js
    │   │   ├── DepartmentForm.js
    │   │   └── Navbar.js
    │   ├── services
    │   │   ├── employeeService.js
    │   │   └── departmentService.js
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   ├── reportWebVitals.js
    │   └── App.css
    │   └── theme.js
    ├── Dockerfile
    ├── postcss.config.js
    ├── tailwind.config.js
    └── package.json
```

## Dependencies

- **React**: Frontend library for building user interfaces.
- **React Router DOM**: For handling routing and navigation.
- **Material-UI**: For UI components and styling.
- **Chart.js**: For rendering charts and graphs.
- **Axios**: For making HTTP requests (if used in `employeeService` and `departmentService`).
- **Tailwind CSS**: For utility-first CSS framework (if used in `App.css`).

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hoangsonww/Employee-Management-Fullstack-App.git
cd Employee-Management/frontend
```

### 2. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project if it doesn't already exist. Add any required environment variables. For example:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Make sure to replace the `REACT_APP_API_URL` with your backend server URL.

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm start
```

This will start the React development server and open the application in your default web browser. The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

To create a production build of your application, run:

```bash
npm run build
```

The build files will be generated in the `build` directory. You can deploy these files to your production server.

### 6. Running Tests

To run tests, use:

```bash
npm test
```

This will start the test runner and execute your test cases.

## Detailed Component Instructions

### `Dashboard.js`

Displays various metrics related to employees, such as total employee count, average age, employee growth over time, and distribution by age range. It uses `react-chartjs-2` to render bar charts.

### `EmployeeList.js`

Shows a list of employees with options to search, paginate, and delete entries. Includes a link to add a new employee and edit existing employees.

### `EmployeeForm.js`

Provides a form for adding or editing employee details. Fetches departments to populate the department dropdown. Uses `useParams` to determine if it's in edit mode or add mode.

### `DepartmentList.js`

Displays a list of departments with options to search, paginate, and delete entries. Includes a link to add a new department and edit existing departments.

### `DepartmentForm.js`

Provides a form for adding or editing department details.

### `Navbar.js`

The navigation bar component that includes links to various pages such as Dashboard, Employees, and Departments. Highlights the currently active page.

## Troubleshooting

- **Error: Cannot read properties of undefined (reading 'id')**: Ensure that the `employee` object in `EmployeeForm` is correctly initialized and that the `id` parameter is correctly passed. Check the `getEmployeeById` and `updateEmployee` functions for proper handling of data.

- **Chart Issues**: Ensure `Chart.js` and `react-chartjs-2` are correctly installed and configured. Verify that the chart data passed to components is in the correct format.

## Contributing

If you'd like to contribute to the project, please fork the repository and submit a pull request with your changes. Ensure that you follow the project's coding standards and include relevant tests for new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please contact [hoangson091104@gmail.com](mailto:hoangson091104@gmail.com).
