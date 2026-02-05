import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const useInView = (ref, { threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = {}) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return inView;
};

const Reveal = ({ children, delay = 0, y = 16, sx, ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
        willChange: 'transform, opacity',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

const AnimatedNumber = ({ value, duration = 1400, decimals = 0, prefix = '', suffix = '', format = 'standard' }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const hasAnimatedRef = useRef(false);
  const inView = useInView(ref, { threshold: 0.35, rootMargin: '0px 0px -15% 0px', once: true });

  const formatter = useMemo(() => {
    if (format === 'compact') {
      return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: decimals });
    }
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }, [decimals, format]);

  useEffect(() => {
    if (!inView || hasAnimatedRef.current) return undefined;
    hasAnimatedRef.current = true;
    let rafId;
    const start = performance.now();

    const animate = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, duration]);

  return (
    <Box component="span" ref={ref} sx={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {formatter.format(display)}
      {suffix}
    </Box>
  );
};

const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const textPrimary = theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a';
  const textSecondary = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#334155';
  const surfaceBg = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)';
  const sectionSpacing = { xs: '3.5rem', md: '4.5rem' };
  const cardShadow = '0 18px 50px rgba(15, 23, 42, 0.12)';
  const cardBorder = '1px solid rgba(15, 23, 42, 0.08)';

  const heroStats = [
    { value: 99.98, decimals: 2, suffix: '%', label: 'Data uptime in the last 12 months' },
    { value: 1.8, decimals: 1, suffix: ' min', label: 'Average export turnaround' },
    { value: 3.2, decimals: 1, suffix: 'x', label: 'Faster approvals for managers' },
  ];

  const benchmarkStats = [
    { value: 42000, label: 'Active employee records maintained', detail: 'Consolidated across divisions and locations.' },
    { value: 185, label: 'Departments organized', detail: 'Clear ownership, headcount, and budgets.' },
    { value: 6.4, decimals: 1, suffix: ' hrs', label: 'Average onboarding cycle', detail: 'From invite to day-one readiness.' },
    { value: 12, suffix: ' mo', label: 'Rolling audit history', detail: 'Structured logs ready for review.' },
    { value: 350, suffix: '+', label: 'Weekly exports delivered', detail: 'Finance and leadership ready.' },
    { value: 98.7, decimals: 1, suffix: '%', label: 'Roster accuracy', detail: 'Validated by automated checks.' },
  ];

  const governanceCards = [
    {
      title: 'Security & governance',
      desc: 'Ensure teams see what they need while protecting sensitive data across the org.',
      icon: <ShieldIcon color="primary" />,
      items: ['Role-based access per department', 'Export logs and approval trails', 'Data retention controls with reminders'],
    },
    {
      title: 'Process automation',
      desc: 'Reduce manual handoffs with task-ready workflows and clear ownership.',
      icon: <BoltIcon color="primary" />,
      items: ['New hire checklists by team', 'Department change alerts', 'Manager approval routing'],
    },
    {
      title: 'Executive reporting',
      desc: 'Pack leadership updates with consistent metrics and clean summaries.',
      icon: <AssessmentIcon color="primary" />,
      items: ['Headcount and growth mix', 'Tenure and age distributions', 'Budget-ready department rollups'],
    },
  ];

  const serviceLevels = [
    { value: 24, suffix: '/7', label: 'Monitoring and alerts', detail: 'Operational coverage for core workflows.' },
    { value: 18, suffix: ' min', label: 'Median response time', detail: 'Team notified on critical exceptions.' },
    { value: 6, suffix: ' regions', label: 'Deployment options', detail: 'Support regional data residency needs.' },
    { value: 250, suffix: '+', label: 'Automation rules', detail: 'Built-in triggers for ops playbooks.' },
  ];

  const reportingBlocks = [
    {
      title: 'Insights that stay fresh',
      desc: 'Dashboards update from the same trusted data set, so every view stays aligned.',
      icon: <InsightsIcon color="primary" />,
      items: ['Headcount, tenure, and mix', 'Department growth momentum', 'Hiring and exit trend snapshots'],
    },
    {
      title: 'Exports that leadership wants',
      desc: 'Share clean, structured exports without extra cleanup or follow-ups.',
      icon: <AutoGraphIcon color="primary" />,
      items: ['CSV-ready tables', 'Filtered department exports', 'Role and location breakdowns'],
    },
    {
      title: 'Confidence in every change',
      desc: 'Updates remain consistent from dashboards to department views.',
      icon: <VerifiedUserIcon color="primary" />,
      items: ['Guardrails on edits', 'Change history visibility', 'Error-aware validation'],
    },
  ];

  const handleScrollToBenchmarks = () => {
    const target = document.getElementById('operational-benchmarks');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            <Reveal>
              <Paper
                sx={{
                  padding: isSmallScreen ? '1.5rem' : '3rem',
                  background: surfaceBg,
                  borderRadius: 3,
                  boxShadow: '0 25px 70px rgba(0,0,0,0.2)',
                  color: textPrimary,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -140,
                    left: -100,
                    width: 260,
                    height: 260,
                    background: 'radial-gradient(circle, rgba(30,60,114,0.18), transparent 60%)',
                    animation: 'floatGlow 10s ease-in-out infinite',
                    pointerEvents: 'none',
                  },
                  '@keyframes floatGlow': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                    '100%': { transform: 'translateY(0px)' },
                  },
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
                  One place for dashboards, departments, and people operations - built for teams that need insights, not spreadsheets.
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: '1.5rem' }}>
                  {heroStats.map(stat => (
                    <Grid item xs={12} sm={4} key={stat.label}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary }}>
                          <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                        </Typography>
                        <Typography variant="body2" color={textSecondary}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={1.5} sx={{ marginTop: '1.5rem' }}>
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { value: 97, suffix: '%', label: 'Teams stay on-plan' },
                    { value: 120, suffix: '+', label: 'Departments organized' },
                    { value: 24, suffix: '/7', label: 'Secure access' },
                  ].map(item => (
                    <Box key={item.label}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary }}>
                        <AnimatedNumber value={item.value} suffix={item.suffix} />
                      </Typography>
                      <Typography variant="body2" color={textSecondary}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ marginTop: '2rem', width: '100%' }}>
                  <Button
                    variant="outlined"
                    onClick={handleScrollToBenchmarks}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.35)' : '#1E3C72',
                      color: textPrimary,
                      paddingY: 1.2,
                      '& .MuiButton-endIcon': { marginLeft: 0.5 },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(30,60,114,0.08)',
                        borderColor: theme.palette.mode === 'dark' ? 'white' : '#1E3C72',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    startIcon={<SpaceDashboardIcon />}
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
                    startIcon={<PeopleAltIcon />}
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
                    { label: 'HR productivity', value: 27, prefix: '+', suffix: '%' },
                    { label: 'Onboarding time', value: 34, prefix: '-', suffix: '%' },
                    { label: 'Data freshness', text: 'Real-time' },
                  ].map(item => (
                    <Grid item xs={12} sm={4} key={item.label}>
                      <Card sx={{ background: surfaceBg, color: textPrimary, border: cardBorder, boxShadow: 'none' }}>
                        <CardContent>
                          <Typography variant="body2" sx={{ opacity: 0.8, color: textSecondary }}>
                            {item.label}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary }}>
                            {item.text ? item.text : <AnimatedNumber value={item.value} prefix={item.prefix} suffix={item.suffix} />}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Reveal delay={80}>
                <Card
                  sx={{
                    padding: 2.5,
                    background: surfaceBg,
                    borderRadius: 3,
                    boxShadow: cardShadow,
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
              </Reveal>
              <Reveal delay={140}>
                <Card
                  sx={{
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
              </Reveal>
            </Stack>
          </Grid>
        </Grid>

        <Box id="operational-benchmarks" sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Operational benchmarks at a glance
            </Typography>
            <Typography color={textSecondary} sx={{ maxWidth: 720, marginBottom: 2 }}>
              A single source of truth translates into measurable outcomes. These benchmarks highlight the operational scale the platform is designed to
              support.
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {benchmarkStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
                <Reveal delay={index * 60}>
                  <Card sx={{ height: '100%', background: surfaceBg, borderRadius: 3, boxShadow: cardShadow, border: cardBorder }}>
                    <CardContent>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: textPrimary }}>
                        <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textPrimary, marginTop: 0.5 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" color={textSecondary}>
                        {stat.detail}
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" color={textSecondary} sx={{ marginTop: 1.5, display: 'block' }}>
            Benchmarks shown are illustrative.
          </Typography>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Trusted by teams that care about clarity
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 700 }}>
              HR, finance, and operations teams rely on shared data for fast decisions, fewer handoffs, and confident reporting.
            </Typography>
          </Reveal>
          <Grid container spacing={2} alignItems="center">
            {['Atlas HR', 'Northwind Ops', 'Acme Labs', 'Cobalt Systems', 'HelioCo'].map((name, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={name}>
                <Reveal delay={index * 50}>
                  <Paper
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      background: surfaceBg,
                      borderRadius: 2,
                      boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: textPrimary }}>
                      {name}
                    </Typography>
                  </Paper>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Governance, automation, and reporting
            </Typography>
            <Typography color={textSecondary} sx={{ maxWidth: 720, marginBottom: 2 }}>
              Keep sensitive data protected, automate the routine, and deliver leadership-ready insights without extra tools.
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {governanceCards.map((card, index) => (
              <Grid item xs={12} md={4} key={card.title}>
                <Reveal delay={index * 80}>
                  <Card sx={{ height: '100%', background: surfaceBg, borderRadius: 3, boxShadow: cardShadow, border: cardBorder }}>
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
                      <Stack spacing={1}>
                        {card.items.map(item => (
                          <Stack key={item} direction="row" spacing={1} alignItems="center">
                            <CheckCircleIcon fontSize="small" color="primary" />
                            <Typography color={textPrimary}>{item}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Built for speed
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 760 }}>
              Every surface is optimized for quick actions - find, update, and export without leaving the page.
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {[
              {
                title: 'Launch updates fast',
                desc: 'Create new employees or departments in minutes with fast, guided workflows.',
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
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Reveal delay={index * 50}>
                  <Card
                    sx={{
                      height: '100%',
                      background: surfaceBg,
                      borderRadius: 3,
                      boxShadow: cardShadow,
                      border: cardBorder,
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
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Everything you need to operate smoothly
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 740 }}>
              From employee profiles to dashboards, every module is designed for fast decisions and confident sharing.
            </Typography>
          </Reveal>
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
            ].map((card, index) => (
              <Grid item xs={12} md={4} key={card.title}>
                <Reveal delay={index * 80}>
                  <Card
                    sx={{
                      background: surfaceBg,
                      borderRadius: 3,
                      height: '100%',
                      boxShadow: cardShadow,
                      border: cardBorder,
                    }}
                  >
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
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Paper
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#0f172a',
                color: 'white',
                borderRadius: 3,
                padding: { xs: 3, md: 4 },
                boxShadow: '0 30px 70px rgba(15, 23, 42, 0.35)',
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" sx={{ fontWeight: 800, marginBottom: 1 }}>
                    Service-level snapshot
                  </Typography>
                  <Typography color="rgba(255,255,255,0.75)">Performance guardrails and automation depth designed for operational confidence.</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {serviceLevels.map((stat, index) => (
                      <Grid item xs={12} sm={6} key={stat.label}>
                        <Reveal delay={index * 60}>
                          <Box sx={{ padding: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              {stat.detail}
                            </Typography>
                          </Box>
                        </Reveal>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Reveal>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Reporting that aligns every team
            </Typography>
            <Typography color={textSecondary} sx={{ maxWidth: 720, marginBottom: 2 }}>
              From dashboards to exports, every output stays consistent so leadership sees the same story.
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {reportingBlocks.map((block, index) => (
              <Grid item xs={12} md={4} key={block.title}>
                <Reveal delay={index * 80}>
                  <Card sx={{ height: '100%', background: surfaceBg, borderRadius: 3, boxShadow: cardShadow, border: cardBorder }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                        {block.icon}
                        <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                          {block.title}
                        </Typography>
                      </Stack>
                      <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                        {block.desc}
                      </Typography>
                      <Stack spacing={1}>
                        {block.items.map(item => (
                          <Stack key={item} direction="row" spacing={1} alignItems="center">
                            <CheckCircleIcon fontSize="small" color="primary" />
                            <Typography color={textPrimary}>{item}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Who’s using it
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 700 }}>
              People leaders, engineering managers, and operations teams use the same data layer to stay aligned.
            </Typography>
          </Reveal>
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
            ].map((persona, index) => (
              <Grid item xs={12} md={4} key={persona.name}>
                <Reveal delay={index * 70}>
                  <Card sx={{ background: surfaceBg, borderRadius: 3, height: '100%', boxShadow: cardShadow, border: cardBorder }}>
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
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Rollout in three steps
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 720 }}>
              Set up once, align departments, and publish insights without disrupting the team.
            </Typography>
          </Reveal>
          <Grid container spacing={2}>
            {[
              { title: 'Secure access', desc: 'Protected routes and login flows keep sensitive data safe.', icon: <VerifiedUserIcon color="primary" /> },
              { title: 'Configure teams', desc: 'Set up departments, employees, and quick actions.', icon: <ShieldIcon color="primary" /> },
              { title: 'Share insights', desc: 'Use dashboards and exports to keep leadership aligned.', icon: <TimelineIcon color="primary" /> },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={step.title}>
                <Reveal delay={index * 70}>
                  <Card sx={{ background: surfaceBg, borderRadius: 3, height: '100%', boxShadow: cardShadow, border: cardBorder }}>
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
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              FAQs
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 640 }}>
              Everything teams usually ask before rollout, answered clearly.
            </Typography>
          </Reveal>
          <Grid container spacing={2}>
            {[
              {
                q: 'Can I export data for finance or ops reviews?',
                a: 'Yes - use the built-in exports in employees and departments to get a clean CSV anytime.',
              },
              { q: 'Does it support remote and hybrid tracking?', a: 'Dashboard charts already visualize remote/hybrid preferences without extra setup.' },
              { q: 'How fast can we onboard?', a: 'Most teams get running in under a day: set roles, add departments, and import employees.' },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={item.q}>
                <Reveal delay={index * 70}>
                  <Accordion disableGutters sx={{ background: surfaceBg, borderRadius: 2, boxShadow: '0 10px 30px rgba(15,23,42,0.1)' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 700, color: textPrimary }}>{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color={textSecondary}>{item.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginTop: sectionSpacing, width: '100%' }}>
          <Reveal>
            <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, marginBottom: 1 }}>
              Implementation timeline
            </Typography>
            <Typography color={textSecondary} sx={{ marginBottom: 2, maxWidth: 680 }}>
              A focused three-day rollout gets your teams aligned without slowing productivity.
            </Typography>
          </Reveal>
          <Grid container spacing={2}>
            {[
              { title: 'Day 1', desc: 'Secure access and invite admins with protected routes.', icon: <VerifiedUserIcon color="primary" /> },
              { title: 'Day 2', desc: 'Import employees, set departments, and verify dashboard charts.', icon: <CorporateFareIcon color="primary" /> },
              { title: 'Day 3', desc: 'Share exports, tune filters, and present insights to leadership.', icon: <AssessmentIcon color="primary" /> },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Reveal delay={index * 70}>
                  <Card sx={{ background: surfaceBg, borderRadius: 3, boxShadow: cardShadow, border: cardBorder, height: '100%' }}>
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
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            marginTop: sectionSpacing,
            marginBottom: { xs: 6, md: 8 },
            backgroundColor: theme.palette.mode === 'dark' ? '#0b1220' : '#111827',
            borderRadius: 3,
            padding: 3,
            boxShadow: '0 25px 70px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
          }}
        >
          <Reveal>
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
                      Filter employees by team, age, or department, then export a clean CSV for finance or leadership reviews - no extra setup required.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Reveal>
        </Box>

        <Box sx={{ marginBottom: { xs: 5, md: 7 }, width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Reveal>
                <Card sx={{ background: surfaceBg, borderRadius: 3, boxShadow: cardShadow, border: cardBorder, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
                      <InsightsIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: textPrimary }}>
                        Weekly pulse
                      </Typography>
                    </Stack>
                    <Typography color={textSecondary} sx={{ marginBottom: 2 }}>
                      Keep leadership aligned with a fast snapshot of headcount, department mix, and growth momentum - all ready to share.
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
              </Reveal>
            </Grid>
            <Grid item xs={12} md={6}>
              <Reveal delay={80}>
                <Card
                  sx={{
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fef3c7',
                    borderRadius: 3,
                    boxShadow: cardShadow,
                    border: cardBorder,
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
              </Reveal>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
