import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  Stack,
  useTheme,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DevicesIcon from '@mui/icons-material/Devices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';

const LandingPage = () => {
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const theme = useTheme();
  const textPrimary = theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a';
  const textSecondary = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#334155';
  const surfaceBg = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)';

  // Animation styles for subtle drop-down effect
  const animationStyle = {
    animation: 'dropDown 0.8s ease forwards',
    opacity: 0,
    '@keyframes dropDown': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'inherit',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          position: 'relative',
          zIndex: 1,
          paddingY: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                ...animationStyle,
                padding: isSmallScreen ? '1.5rem' : '3rem',
                background: surfaceBg,
                borderRadius: 3,
                boxShadow: '0 25px 70px rgba(0,0,0,0.2)',
                color: textPrimary,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -80,
                  right: -60,
                  width: 220,
                  height: 220,
                  background: 'radial-gradient(circle, rgba(30,60,114,0.15), transparent 55%)',
                  pointerEvents: 'none',
                }}
              />
              <Typography variant="overline" sx={{ letterSpacing: 2, color: textSecondary }}>
                EMPLOYEE MANAGEMENT
              </Typography>
              <Typography variant={isSmallScreen ? 'h4' : 'h2'} sx={{ fontWeight: 800, marginTop: '0.5rem', lineHeight: 1.05, color: textPrimary }}>
                Run your workforce with clarity and confidence.
              </Typography>
              <Typography variant="h6" sx={{ marginTop: '1rem', color: textSecondary }}>
                One place for dashboards, departments, and people operations—built for teams that need insights, not spreadsheets.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1.5rem' }}>
                <Stack>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color={textSecondary}>
                    Uptime for your org data
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary }}>
                    &lt; 2m
                  </Typography>
                  <Typography variant="body2" color={textSecondary}>
                    To export the latest roster
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary }}>
                    3x
                  </Typography>
                  <Typography variant="body2" color={textSecondary}>
                    Faster approvals
                  </Typography>
                </Stack>
              </Stack>
              <Grid container spacing={1.5} sx={{ marginTop: '1rem' }}>
                {['Faster onboarding', 'Role-based access', 'Export-ready data', 'Insightful dashboards'].map(label => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Chip
                      label={label}
                      icon={<CheckCircleIcon fontSize="small" />}
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(30,60,114,0.08)',
                        color: textPrimary,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { value: '97%', label: 'Teams stay on-plan' },
                  { value: '120+', label: 'Departments organized' },
                  { value: '24/7', label: 'Secure access' },
                ].map(item => (
                  <Box key={item.label}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color={textSecondary}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ marginTop: '2rem', width: '100%' }}>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: '#0f172a',
                    fontWeight: 700,
                    paddingY: 1.2,
                    '&:hover': { backgroundColor: '#ffa726', color: '#0f172a' },
                  }}
                >
                  View Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/employees"
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.35)' : '#1E3C72',
                    color: textPrimary,
                    paddingY: 1.2,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(30,60,114,0.08)',
                      borderColor: theme.palette.mode === 'dark' ? 'white' : '#1E3C72',
                    },
                  }}
                >
                  Browse Directory
                </Button>
              </Stack>
              <Grid container spacing={2} sx={{ marginTop: '2rem' }}>
                {[
                  { label: 'HR productivity', value: '+27%' },
                  { label: 'Onboarding time', value: '-34%' },
                  { label: 'Data freshness', value: 'Real-time' },
                ].map(item => (
                  <Grid item xs={12} sm={4} key={item.label}>
                    <Card sx={{ background: surfaceBg, color: textPrimary, border: '1px solid rgba(0,0,0,0.04)' }}>
                      <CardContent>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: textSecondary }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary }}>
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Card
                sx={{
                  ...animationStyle,
                  padding: 2.5,
                  background: surfaceBg,
                  borderRadius: 3,
                  boxShadow: '0 20px 55px rgba(15, 23, 42, 0.18)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 1, color: textPrimary }}>
                  Playbook preview
                </Typography>
                <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                  Modern HR teams rely on a single source of truth. Here’s how we keep your data actionable.
                </Typography>
                <Stack spacing={1.2}>
                  {['Smart filters and exports', 'Pulse dashboards with headcount trends', 'Instant onboarding journeys'].map(item => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3f51b5' }} />
                      <Typography color={textPrimary}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
              <Card
                sx={{
                  ...animationStyle,
                  padding: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#1E293B',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 20px 55px rgba(15, 23, 42, 0.25)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                  Quick links
                </Typography>
                <Stack spacing={1} sx={{ marginTop: 1 }}>
                  <Button
                    component={Link}
                    to="/departments"
                    variant="outlined"
                    sx={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', '&:hover': { borderColor: 'white' } }}
                  >
                    Manage departments
                  </Button>
                  <Button
                    component={Link}
                    to="/add-employee"
                    variant="outlined"
                    sx={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', '&:hover': { borderColor: 'white' } }}
                  >
                    Add employee
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    sx={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', '&:hover': { borderColor: 'white' } }}
                  >
                    Create account
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 2 }}>
            Trusted by teams that care about clarity
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {['Atlas HR', 'Northwind Ops', 'Acme Labs', 'Cobalt Systems', 'HelioCo'].map(name => (
              <Grid item xs={6} sm={4} md={2.4} key={name}>
                <Paper sx={{ padding: 2, textAlign: 'center', background: surfaceBg, borderRadius: 2, boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: textPrimary }}>
                    {name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Grid container spacing={3}>
            {[
              {
                title: 'Built for speed',
                desc: 'Launch updates in minutes with quick actions and role-aware routing.',
                icon: <RocketLaunchIcon color="primary" />,
              },
              {
                title: 'Data integrity',
                desc: 'Secure flows backed by protected routes and consistent data surfaces.',
                icon: <VerifiedUserIcon color="primary" />,
              },
              { title: 'Always in sync', desc: 'Charts, filters, and exports run off the same clean data set.', icon: <AutoGraphIcon color="primary" /> },
              { title: 'Any device', desc: 'Responsive layouts make dashboards and lists usable on the go.', icon: <DevicesIcon color="primary" /> },
              { title: 'Insights-first', desc: 'KPIs, mixes, and cohort trends visible without extra tools.', icon: <InsightsIcon color="primary" /> },
              { title: 'Human support', desc: 'Friendly guidance baked into flows and quick links.', icon: <SupportAgentIcon color="primary" /> },
            ].map(feature => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Card
                  sx={{
                    height: '100%',
                    background: surfaceBg,
                    borderRadius: 3,
                    boxShadow: '0 16px 45px rgba(15, 23, 42, 0.1)',
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                        {feature.title}
                      </Typography>
                    </Stack>
                    <Typography color={textSecondary}>{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '4rem', width: '100%' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, marginBottom: '1rem' }}>
            Everything you need to operate smoothly
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: 'Employee 360',
                desc: 'Full profiles, quick edits, exports, and smart filters for any slice of your org.',
                link: '/employees',
                icon: <BoltIcon color="primary" />,
              },
              {
                title: 'Department clarity',
                desc: 'Keep teams organized with clean structures and quick pivots between units.',
                link: '/departments',
                icon: <ShieldIcon color="primary" />,
              },
              {
                title: 'Insightful dashboards',
                desc: 'Trend lines, cohorts, and composition charts to see what’s moving the needle.',
                link: '/dashboard',
                icon: <TimelineIcon color="primary" />,
              },
            ].map(card => (
              <Grid item xs={12} md={4} key={card.title}>
                <Card sx={{ background: surfaceBg, borderRadius: 3, height: '100%', boxShadow: '0 16px 45px rgba(15, 23, 42, 0.12)' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                      {card.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                        {card.title}
                      </Typography>
                    </Stack>
                    <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                      {card.desc}
                    </Typography>
                    <Button component={Link} to={card.link} variant="contained">
                      Open
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 2 }}>
            Who’s using it
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                name: 'People Ops',
                title: 'HR Lead',
                quote: 'We went from ad-hoc spreadsheets to instant exports that finance loves.',
                icon: <WorkspacePremiumIcon color="primary" />,
              },
              {
                name: 'Tech Leads',
                title: 'Engineering Manager',
                quote: 'Charts and filters answer headcount questions before they’re asked.',
                icon: <TrendingUpIcon color="primary" />,
              },
              {
                name: 'Leadership',
                title: 'VP, Operations',
                quote: 'Department and growth mix are clear enough for board updates.',
                icon: <EmojiEventsIcon color="primary" />,
              },
            ].map(persona => (
              <Grid item xs={12} md={4} key={persona.name}>
                <Card sx={{ background: surfaceBg, borderRadius: 3, height: '100%', boxShadow: '0 14px 40px rgba(15, 23, 42, 0.12)' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ marginBottom: 1 }}>
                      <Avatar sx={{ bgcolor: '#1E3C72', color: '#fff' }}>{persona.name[0]}</Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {persona.icon}
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textPrimary }}>
                            {persona.name}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color={textSecondary}>
                          {persona.title}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography color={textSecondary}>"{persona.quote}"</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 2 }}>
            Rollout in three steps
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'Secure access', desc: 'Protected routes and login flows keep sensitive data safe.', icon: <VerifiedUserIcon color="primary" /> },
              { title: 'Configure teams', desc: 'Set up departments, employees, and quick actions.', icon: <ShieldIcon color="primary" /> },
              { title: 'Share insights', desc: 'Use dashboards and exports to keep leadership aligned.', icon: <TimelineIcon color="primary" /> },
            ].map(step => (
              <Grid item xs={12} md={4} key={step.title}>
                <Card sx={{ background: surfaceBg, borderRadius: 3, height: '100%', boxShadow: '0 14px 40px rgba(15, 23, 42, 0.12)' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {step.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                        {step.title}
                      </Typography>
                    </Stack>
                    <Typography color={textSecondary} sx={{ marginTop: 1 }}>
                      {step.desc}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginTop: 1.5 }}>
                      <Chip label="Guided" color="primary" size="small" />
                      <Chip label="Fast" color="secondary" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 2 }}>
            FAQs
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                q: 'Can I export data for finance or ops reviews?',
                a: 'Yes—use the built-in exports in employees and departments to get a clean CSV anytime.',
              },
              { q: 'Does it support remote and hybrid tracking?', a: 'Dashboard charts already visualize remote/hybrid preferences without extra setup.' },
              { q: 'How fast can we onboard?', a: 'Most teams get running in under a day: set roles, add departments, and import employees.' },
            ].map(item => (
              <Grid item xs={12} md={4} key={item.q}>
                <Accordion disableGutters sx={{ background: surfaceBg, borderRadius: 2, boxShadow: '0 10px 30px rgba(15,23,42,0.1)' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700, color: textPrimary }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color={textSecondary}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: '3rem', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 2 }}>
            Implementation timeline
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'Day 1', desc: 'Secure access and invite admins with protected routes.', icon: <VerifiedUserIcon color="primary" /> },
              { title: 'Day 2', desc: 'Import employees, set departments, and verify dashboard charts.', icon: <CorporateFareIcon color="primary" /> },
              { title: 'Day 3', desc: 'Share exports, tune filters, and present insights to leadership.', icon: <AssessmentIcon color="primary" /> },
            ].map(item => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card sx={{ background: surfaceBg, borderRadius: 3, boxShadow: '0 14px 40px rgba(15, 23, 42, 0.12)', height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                      {item.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography color={textSecondary}>{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            marginTop: '4rem',
            marginBottom: { xs: 6, md: 8 },
            backgroundColor: theme.palette.mode === 'dark' ? '#0b1220' : '#111827',
            borderRadius: 3,
            padding: 3,
            boxShadow: '0 25px 70px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', marginBottom: 1 }}>
                Ready to see it live?
              </Typography>
              <Typography color="rgba(255,255,255,0.85)" sx={{ marginBottom: 2 }}>
                Jump into the dashboard, filter employees, and ship updates without extra tooling.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ backgroundColor: '#ff9800', color: '#0f172a', fontWeight: 700, '&:hover': { backgroundColor: '#ffa726', color: '#0f172a' } }}
              >
                Sign in
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#111827', borderRadius: 3, color: 'white', padding: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontWeight: 700 }}>
                    Highlight: Export-ready data
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Filter employees by team, age, or department, then export a clean CSV for finance or leadership reviews—no extra setup required.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginBottom: { xs: 5, md: 7 }, width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: surfaceBg, borderRadius: 3, boxShadow: '0 20px 50px rgba(15,23,42,0.12)', height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                    <InsightsIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                      Weekly pulse
                    </Typography>
                  </Stack>
                  <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                    Keep leadership aligned with a fast snapshot of headcount, department mix, and growth momentum—all ready to share.
                  </Typography>
                  <Stack spacing={1}>
                    {['Momentum trends auto-refresh', 'Headcount and age mix at a glance', 'Export-ready summaries'].map(item => (
                      <Stack key={item} direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon fontSize="small" color="primary" />
                        <Typography color={textPrimary}>{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fef3c7',
                  borderRadius: 3,
                  boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                    <SupportAgentIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                      Smooth rollout plan
                    </Typography>
                  </Stack>
                  <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                    A simple three-step workflow to get everyone on board without slowing the team down.
                  </Typography>
                  <Stack spacing={1.2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Step 1" color="primary" size="small" />
                      <Typography color={textPrimary}>Secure access with login and protected routes.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Step 2" color="primary" size="small" />
                      <Typography color={textPrimary}>Invite managers to manage employees and departments.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Step 3" color="primary" size="small" />
                      <Typography color={textPrimary}>Share dashboards with leadership and export summaries.</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
