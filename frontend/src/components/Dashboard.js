import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getAllEmployees } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card, CardContent, Grid, Typography, Box, CircularProgress, Button, Stack, Chip, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState([]);
  const [ageRangeData, setAgeRangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderData] = useState({ male: 295 - 120, female: 120 });
  const [jobSatisfactionData] = useState({ satisfied: 295 - 50 - 30, neutral: 50, dissatisfied: 30 });
  const [remoteWorkData] = useState({ onsite: 295 - 70 - 80, remote: 70, hybrid: 80 });
  const [topDepartments, setTopDepartments] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
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

      employees.forEach(emp => {
        if (emp.age >= 20 && emp.age <= 29) ageRanges['20-29'] += 1;
        else if (emp.age >= 30 && emp.age <= 39) ageRanges['30-39'] += 1;
        else if (emp.age >= 40 && emp.age <= 49) ageRanges['40-49'] += 1;
        else if (emp.age >= 50 && emp.age <= 59) ageRanges['50-59'] += 1;
        else if (emp.age >= 60) ageRanges['60+'] += 1;
      });

      setAgeRangeData(ageRanges);

      const departmentHeadcount = employees.reduce((acc, emp) => {
        const name = emp.department?.name || 'Unassigned';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const topThreeDepartments = Object.entries(departmentHeadcount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }));

      setTopDepartments(topThreeDepartments);

      const newestEmployees = [...employees].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);
      setRecentEmployees(newestEmployees);

      setEmployeeGrowth([
        { month: 'January', count: 50 },
        { month: 'February', count: 70 },
        { month: 'March', count: 100 },
        { month: 'April', count: 130 },
        { month: 'May', count: 160 },
        { month: 'June', count: 200 },
      ]);

      setLoading(false); // Set loading to false when data is fetched
    };
    fetchData();
  }, []);

  const animationStyle = {
    animation: 'dropDown 0.8s ease forwards',
    opacity: 0,
    '@keyframes dropDown': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  };

  const cardBase = {
    ...animationStyle,
    boxShadow: '0 20px 55px rgba(14, 30, 68, 0.12)',
    borderRadius: 3,
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(15, 23, 42, 0.06)',
  };

  const gradientCards = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  ];

  const username = localStorage.getItem('EMSusername') || 'there';
  const averageTeamSize = departmentCount ? (employeeCount / departmentCount).toFixed(1) : 0;
  const projectedGrowth = employeeGrowth.length
    ? Math.round(((employeeGrowth[employeeGrowth.length - 1].count - employeeGrowth[0].count) / employeeGrowth[0].count) * 100)
    : 0;
  const hybridShare =
    remoteWorkData.hybrid + remoteWorkData.remote + remoteWorkData.onsite
      ? Math.round((remoteWorkData.hybrid / (remoteWorkData.hybrid + remoteWorkData.remote + remoteWorkData.onsite)) * 100)
      : 0;

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

  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [genderData.male, genderData.female],
        backgroundColor: ['#42A5F5', '#FF7043'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const jobSatisfactionChartData = {
    labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
    datasets: [
      {
        label: 'Job Satisfaction Levels',
        data: [jobSatisfactionData.satisfied, jobSatisfactionData.neutral, jobSatisfactionData.dissatisfied],
        backgroundColor: ['#81C784', '#FFEB3B', '#FF7043'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const remoteWorkChartData = {
    labels: ['Onsite', 'Remote', 'Hybrid'],
    datasets: [
      {
        label: 'Remote Work Preference',
        data: [remoteWorkData.onsite, remoteWorkData.remote, remoteWorkData.hybrid],
        backgroundColor: ['#4FC3F7', '#FFB74D', '#9575CD'],
        borderColor: ['#ffffff'],
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
        labels: employeeGrowth.map(d => d.month),
        datasets: [
          {
            label: 'Employee Growth Over Time',
            data: employeeGrowth.map(d => d.count),
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const lineChartData = employeeGrowth.length
    ? {
        labels: employeeGrowth.map(d => d.month),
        datasets: [
          {
            label: 'Employee Growth Trend',
            data: employeeGrowth.map(d => d.count),
            fill: false,
            borderColor: '#FF6384',
            tension: 0.1,
          },
        ],
      }
    : null;

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

  const departmentMixData =
    topDepartments.length > 0
      ? {
          labels: topDepartments.map(d => d.name),
          datasets: [
            {
              label: 'Headcount by Top Departments',
              data: topDepartments.map(d => d.count),
              backgroundColor: ['#42A5F5', '#66BB6A', '#FF7043', '#AB47BC'],
              borderColor: ['#ffffff'],
              borderWidth: 1,
            },
          ],
        }
      : null;

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          borderRadius: 3,
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          color: 'white',
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 1 }}>
          Welcome back, {username} 👋
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 620, opacity: 0.9 }}>
          Your organization pulse at a glance. Use the quick actions to keep your headcount, departments, and hiring momentum on track.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/add-employee')}
            sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}
          >
            Add employee
          </Button>
          <Button
            variant="outlined"
            startIcon={<GroupWorkIcon />}
            onClick={() => navigate('/add-department')}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)', '&:hover': { borderColor: 'white' } }}
          >
            New department
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListAltIcon />}
            onClick={() => navigate('/employees')}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)', '&:hover': { borderColor: 'white' } }}
          >
            View directory
          </Button>
        </Stack>
      </Box>

      <Typography variant="h4" component="h1" sx={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
        Overview Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[0],
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Total Employees
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {employeeCount}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
                Active team members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[1],
              color: '#1f2937',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Average Age
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {averageAge}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
                Balanced experience
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[2],
              color: '#0f172a',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Total Departments
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {departmentCount}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
                Organizational pods
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardBase,
              background: gradientCards[3],
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                Avg Team Size
              </Typography>
              <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {averageTeamSize}
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ opacity: 0.85 }}>
                Employees per department
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ ...cardBase, position: 'relative' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ marginBottom: '0.5rem' }}>
                <Typography variant="h6">Momentum</Typography>
                <Chip color="success" label={`+${projectedGrowth}% vs Jan`} size="small" icon={<TrendingUpIcon />} />
              </Stack>
              {employeeGrowthData ? <Bar data={employeeGrowthData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Team Snapshot</Typography>
              <Stack spacing={1} sx={{ marginTop: '0.5rem' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Hybrid preference</Typography>
                  <Typography fontWeight={600}>{hybridShare}%</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Gender balance</Typography>
                  <Typography fontWeight={600}>
                    {genderData.female} / {genderData.male} female / male
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Job satisfaction</Typography>
                  <Typography fontWeight={600}>{jobSatisfactionData.satisfied} satisfied</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ marginY: '0.75rem' }} />
              <Typography variant="subtitle2" gutterBottom>
                Top departments
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {topDepartments.length ? (
                  topDepartments.map(dept => <Chip key={dept.name} label={`${dept.name} · ${dept.count}`} color="primary" variant="outlined" />)
                ) : (
                  <Typography color="text.secondary">No department data yet.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Total Overview</Typography>
              <Bar data={totalOverviewData} options={{ scales: { y: { beginAtZero: true, suggestedMax: 30 } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Employee Count by Age Range</Typography>
              <Bar data={ageRangeChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Employee Growth Over Time</Typography>
              {employeeGrowthData ? <Bar data={employeeGrowthData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Average Age of Employees</Typography>
              <Bar data={averageAgeChartData} options={{ scales: { y: { beginAtZero: true, suggestedMax: 100 } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Employee Growth Trend</Typography>
              {lineChartData ? <Line data={lineChartData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Gender Distribution</Typography>
              <Bar data={genderChartData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Job Satisfaction Levels</Typography>
              <Pie data={jobSatisfactionChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Remote Work Preference</Typography>
              <Pie data={remoteWorkChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Top Department Mix</Typography>
              {departmentMixData ? <Pie data={departmentMixData} /> : <Typography>No department distribution yet.</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Recent Employees</Typography>
              {recentEmployees.length ? (
                <Stack spacing={1.2} sx={{ marginTop: '0.5rem' }}>
                  {recentEmployees.map(emp => (
                    <Stack
                      key={`${emp.id}-${emp.email}`}
                      direction="row"
                      justifyContent="space-between"
                      sx={{ padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: 1 }}
                    >
                      <Typography fontWeight={600}>
                        {emp.firstName} {emp.lastName}
                      </Typography>
                      <Typography color="text.secondary">{emp.department?.name || 'Unassigned'}</Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" sx={{ marginTop: '0.5rem' }}>
                  No recent employees to show yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardBase }}>
            <CardContent>
              <Typography variant="h6">Age Range Distribution</Typography>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
