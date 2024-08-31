import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getAllEmployees } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState([]);
  const [ageRangeData, setAgeRangeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const employees = await getAllEmployees();
      const departments = await getAllDepartments();
      setEmployeeCount(employees.length);
      setDepartmentCount(departments.length);

      const totalAge = employees.reduce((sum, emp) => sum + emp.age, 0);
      const avgAge = employees.length ? totalAge / employees.length : 0;
      setAverageAge(avgAge.toFixed(1));

      const ageRanges = {
        '20-29': 0,
        '30-39': 0,
        '40-49': 0,
        '50-59': 0,
        '60+': 0,
      };

      employees.forEach((emp) => {
        if (emp.age >= 20 && emp.age <= 29) ageRanges['20-29'] += 1;
        else if (emp.age >= 30 && emp.age <= 39) ageRanges['30-39'] += 1;
        else if (emp.age >= 40 && emp.age <= 49) ageRanges['40-49'] += 1;
        else if (emp.age >= 50 && emp.age <= 59) ageRanges['50-59'] += 1;
        else if (emp.age >= 60) ageRanges['60+'] += 1;
      });

      setAgeRangeData(ageRanges);

      setEmployeeGrowth([
        { month: 'January', count: 50 },
        { month: 'February', count: 70 },
        { month: 'March', count: 100 },
        { month: 'April', count: 130 },
        { month: 'May', count: 160 },
        { month: 'June', count: 200 },
      ]);
    };
    fetchData();
  }, []);

  const totalOverviewData = {
    labels: ['Employees', 'Departments'],
    datasets: [
      {
        label: 'Total Count',
        data: [employeeCount, departmentCount],
        backgroundColor: ['#3f51b5', '#ff9800'],
        borderColor: ['#3f51b5', '#ff9800'],
        borderWidth: 1,
      },
    ],
  };

  const ageRangeChartData = {
    labels: Object.keys(ageRangeData),
    datasets: [
      {
        label: 'Employees per Age Range',
        data: Object.values(ageRangeData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const averageAgeChartData = {
    labels: ['Average Age'],
    datasets: [
      {
        label: 'Average Age of Employees',
        data: [parseFloat(averageAge)],
        backgroundColor: ['#8BC34A'],
        borderColor: ['#8BC34A'],
        borderWidth: 1,
      },
    ],
  };

  const employeeGrowthData = employeeGrowth.length
    ? {
      labels: employeeGrowth.map((d) => d.month),
      datasets: [
        {
          label: 'Employee Growth Over Time',
          data: employeeGrowth.map((d) => d.count),
          backgroundColor: '#36A2EB',
          borderColor: '#36A2EB',
          borderWidth: 1,
        },
      ],
    }
    : null;

  // Chart data for employee growth over time (Line chart)
  const lineChartData = employeeGrowth.length
    ? {
      labels: employeeGrowth.map((d) => d.month),
      datasets: [
        {
          label: 'Employee Growth Trend',
          data: employeeGrowth.map((d) => d.count),
          fill: false,
          borderColor: '#FF6384',
          tension: 0.1,
        },
      ],
    }
    : null;

  // Pie chart data for age range distribution
  const pieChartData = {
    labels: Object.keys(ageRangeData),
    datasets: [
      {
        label: 'Age Range Distribution',
        data: Object.values(ageRangeData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
        Overview Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Total Overview Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Overview
              </Typography>
              <Bar data={totalOverviewData} options={{ scales: { y: { beginAtZero: true, suggestedMax: 30 } }}} />
            </CardContent>
          </Card>
        </Grid>

        {/* Employee Count by Age Range Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Employee Count by Age Range
              </Typography>
              <Bar data={ageRangeChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Employee Growth Over Time Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Employee Growth Over Time
              </Typography>
              {employeeGrowthData ? <Bar data={employeeGrowthData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Average Age of Employees Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Average Age of Employees
              </Typography>
              <Bar data={averageAgeChartData} options={{ scales: { y: { beginAtZero: true, suggestedMax: 100 } } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart for Age Range Distribution */}
        <Grid item xs={12} md={6} mb={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Age Range Distribution
              </Typography>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart for Employee Growth Trend */}
        <Grid item xs={12} md={6} mb={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Employee Growth Trend
              </Typography>
              {lineChartData ? <Line data={lineChartData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
