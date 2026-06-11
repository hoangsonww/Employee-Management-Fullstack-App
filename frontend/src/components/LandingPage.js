import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DevicesIcon from '@mui/icons-material/Devices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HubIcon from '@mui/icons-material/Hub';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeroBackground from './hero3d/HeroBackground';

/* ------------------------------------------------------------------ *
 * Design tokens — one cohesive dark surface for the whole page.
 * ------------------------------------------------------------------ */
const TEXT = '#f8fafc';
const TEXT2 = 'rgba(255,255,255,0.74)';
const TEXT3 = 'rgba(255,255,255,0.52)';
const PAGE_BG =
  'radial-gradient(circle at 15% 12%, rgba(79,124,255,0.16), transparent 40%),' +
  'radial-gradient(circle at 85% 8%, rgba(255,152,0,0.10), transparent 38%),' +
  'radial-gradient(circle at 50% 100%, rgba(124,92,255,0.14), transparent 52%),' +
  'linear-gradient(180deg, #070b16 0%, #0a1326 50%, #070b16 100%)';
const TEXT_GRADIENT = 'linear-gradient(90deg,#60a5fa 0%,#a78bfa 48%,#ff9800 100%)';

const gradientText = (gradient = TEXT_GRADIENT) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
});

// Translucent — used only for small chrome (nav bar, chips, pills).
const GLASS = {
  background: 'rgba(255,255,255,0.045)',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 18px 50px rgba(2,6,20,0.45)',
};

// Solid (opaque) surface — used for all cards so the 3D never shows through them.
const SURFACE = {
  background: 'linear-gradient(180deg, #121d3a 0%, #0c1428 100%)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '0 18px 50px rgba(2,6,20,0.5)',
};

// Opaque card with an enforced minimum height so every card in a section matches.
const cardSx = (minHeight = 0) => ({
  ...SURFACE,
  height: '100%',
  minHeight,
  borderRadius: '20px',
  transition: 'transform .3s cubic-bezier(0.22,1,0.36,1), box-shadow .3s ease, border-color .3s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: 'rgba(96,165,250,0.5)',
    boxShadow: '0 30px 70px rgba(2,6,20,0.6)',
  },
});

/* ------------------------------------------------------------------ *
 * Hooks
 * ------------------------------------------------------------------ */
const useInView = (ref, { threshold = 0.18, rootMargin = '0px 0px -10% 0px', once = true } = {}) => {
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

const useScrolled = (offset = 28) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
};

const scrollToId = id => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ------------------------------------------------------------------ *
 * Presentational primitives
 * ------------------------------------------------------------------ */
const Reveal = ({ children, delay = 0, y = 18, sx, ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 720ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 720ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'transform, opacity',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', opacity: 1, transform: 'none' },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

const AnimatedNumber = ({ value, duration = 1500, decimals = 0, prefix = '', suffix = '', format = 'standard' }) => {
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
      setDisplay(value * eased);
      if (progress < 1) rafId = requestAnimationFrame(animate);
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

const Eyebrow = ({ children, sx }) => (
  <Typography
    sx={{ display: 'inline-block', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 800, fontSize: '0.78rem', mb: 1.5, ...gradientText(), ...sx }}
  >
    {children}
  </Typography>
);

const SectionHeading = ({ eyebrow, title, subtitle, center = false, maxWidth = 760 }) => (
  <Box sx={{ maxWidth, mx: center ? 'auto' : 0, textAlign: center ? 'center' : 'left', mb: { xs: 4, md: 6 } }}>
    <Reveal>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Typography
        component="h2"
        sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: { xs: '1.9rem', sm: '2.2rem', md: '2.7rem' }, color: TEXT }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ mt: 2, color: TEXT2, fontSize: { xs: '1rem', md: '1.14rem' }, lineHeight: 1.65, mx: center ? 'auto' : 0 }}>{subtitle}</Typography>
      )}
    </Reveal>
  </Box>
);

const sectionAnchor = { scrollMarginTop: '92px' };
const sectionPad = { py: { xs: 6, md: 9 } };

const IconBadge = ({ children, from = '#4f7cff', to = '#7c5cff', size = 50 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      background: `linear-gradient(135deg, ${from}, ${to})`,
      boxShadow: `0 12px 28px ${from}66`,
      flexShrink: 0,
      '& svg': { fontSize: size * 0.5 },
    }}
  >
    {children}
  </Box>
);

/* ------------------------------------------------------------------ *
 * Header (replaces the global navbar on the landing route)
 * ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Features', id: 'features' },
  { label: 'Metrics', id: 'operational-benchmarks' },
  { label: 'Workflow', id: 'workflow' },
  { label: 'FAQ', id: 'faq' },
];

const Logo = () => (
  <Stack direction="row" spacing={1.2} alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none' }}>
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: '11px',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        background: 'linear-gradient(135deg,#1E3C72,#4f7cff 60%,#7c5cff)',
        boxShadow: '0 8px 22px rgba(79,124,255,0.5)',
      }}
    >
      <HubIcon sx={{ fontSize: 22 }} />
    </Box>
    <Typography sx={{ fontWeight: 800, letterSpacing: '-0.01em', fontSize: '1.12rem', color: '#fff' }}>
      Employee
      <Box component="span" sx={gradientText()}>
        OS
      </Box>
    </Typography>
  </Stack>
);

const LandingHeader = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  const handleNav = id => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        transition: 'background-color .3s ease, box-shadow .3s ease, border-color .3s ease',
        backgroundColor: scrolled ? 'rgba(8,13,28,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(160%) blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(160%) blur(16px)' : 'none',
        boxShadow: scrolled ? '0 10px 34px rgba(2,6,20,0.5)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, md: 4 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: { xs: 64, md: 76 } }}>
          <Logo />

          {isDesktop && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {NAV_LINKS.map(link => (
                <Button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: TEXT2,
                    px: 1.6,
                    '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}

          {isDesktop ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={Link}
                to="/login"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  px: 2,
                  border: '1px solid rgba(255,255,255,0.28)',
                  '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/dashboard"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontWeight: 800,
                  px: 2.4,
                  color: '#0f172a',
                  background: 'linear-gradient(135deg,#ffb74d,#ff9800)',
                  boxShadow: '0 10px 26px rgba(255,152,0,0.42)',
                  transition: 'all .25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg,#ffc163,#ffa31a)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 14px 32px rgba(255,152,0,0.5)',
                  },
                }}
              >
                Open Dashboard
              </Button>
            </Stack>
          ) : (
            <IconButton onClick={() => setOpen(true)} aria-label="Open menu" sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 300, background: PAGE_BG, color: '#fff', borderLeft: '1px solid rgba(255,255,255,0.1)' } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Logo />
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu" sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
        <List sx={{ px: 1.5, py: 1 }}>
          {NAV_LINKS.map(link => (
            <ListItemButton key={link.id} onClick={() => handleNav(link.id)} sx={{ borderRadius: 2, my: 0.5 }}>
              <ListItemText primaryTypographyProps={{ fontWeight: 700, fontSize: '1.05rem' }} primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Stack spacing={1.5} sx={{ p: 2.5, mt: 'auto' }}>
          <Button
            component={Link}
            to="/login"
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontWeight: 700, '&:hover': { borderColor: '#fff' } }}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            onClick={() => setOpen(false)}
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              background: 'linear-gradient(135deg,#ffb74d,#ff9800)',
              '&:hover': { background: 'linear-gradient(135deg,#ffc163,#ffa31a)' },
            }}
          >
            Open Dashboard
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

/* ------------------------------------------------------------------ *
 * Data
 * ------------------------------------------------------------------ */
const heroStats = [
  { value: 99.98, decimals: 2, suffix: '%', label: 'Data uptime in the last 12 months' },
  { value: 1.8, decimals: 1, suffix: ' min', label: 'Average export turnaround' },
  { value: 3.2, decimals: 1, suffix: 'x', label: 'Faster approvals for managers' },
];

const benchmarkStats = [
  { value: 42000, suffix: '+', format: 'compact', label: 'Active employee records', detail: 'Consolidated across divisions and locations.' },
  { value: 185, label: 'Departments organized', detail: 'Clear ownership, headcount, and budgets.' },
  { value: 6.4, decimals: 1, suffix: ' hrs', label: 'Average onboarding cycle', detail: 'From invite to day-one readiness.' },
  { value: 12, suffix: ' mo', label: 'Rolling audit history', detail: 'Structured logs ready for review.' },
  { value: 350, suffix: '+', label: 'Weekly exports delivered', detail: 'Finance and leadership ready.' },
  { value: 98.7, decimals: 1, suffix: '%', label: 'Roster accuracy', detail: 'Validated by automated checks.' },
];

const features = [
  {
    title: 'Employee 360',
    desc: 'Full profiles, quick edits, exports, and smart filters for any slice of your org.',
    icon: <PeopleAltIcon />,
    from: '#4f7cff',
    to: '#1E3C72',
    link: '/employees',
  },
  {
    title: 'Department clarity',
    desc: 'Keep teams organized with clean structures and quick pivots between units.',
    icon: <ShieldIcon />,
    from: '#7c5cff',
    to: '#4f7cff',
    link: '/departments',
  },
  {
    title: 'Insightful dashboards',
    desc: 'Trend lines, cohorts, and composition charts that show what moves the needle.',
    icon: <TimelineIcon />,
    from: '#22d3ee',
    to: '#3b82f6',
    link: '/dashboard',
  },
  {
    title: 'Launch updates fast',
    desc: 'Create employees or departments in minutes with guided, validated workflows.',
    icon: <RocketLaunchIcon />,
    from: '#ff9800',
    to: '#f97316',
  },
  {
    title: 'Always in sync',
    desc: 'Charts, filters, and exports all run off the same single source of truth.',
    icon: <AutoGraphIcon />,
    from: '#10b981',
    to: '#059669',
  },
  {
    title: 'Any device',
    desc: 'Responsive layouts keep dashboards and lists usable anywhere you work.',
    icon: <DevicesIcon />,
    from: '#60a5fa',
    to: '#7c5cff',
  },
];

const platformPillars = [
  {
    title: 'Security & governance',
    desc: 'Teams see what they need while sensitive data stays protected across the org.',
    icon: <ShieldIcon />,
    from: '#4f7cff',
    to: '#1E3C72',
    items: ['Role-based access per department', 'Export logs and approval trails', 'Data retention controls with reminders'],
  },
  {
    title: 'Process automation',
    desc: 'Reduce manual handoffs with task-ready workflows and clear ownership.',
    icon: <BoltIcon />,
    from: '#7c5cff',
    to: '#4f7cff',
    items: ['New-hire checklists by team', 'Department change alerts', 'Manager approval routing'],
  },
  {
    title: 'Executive reporting',
    desc: 'Pack leadership updates with consistent metrics and clean summaries.',
    icon: <AssessmentIcon />,
    from: '#22d3ee',
    to: '#3b82f6',
    items: ['Headcount and growth mix', 'Tenure and age distributions', 'Budget-ready department rollups'],
  },
];

const serviceLevels = [
  { value: 24, suffix: '/7', label: 'Monitoring and alerts', detail: 'Operational coverage for core workflows.' },
  { value: 18, suffix: ' min', label: 'Median response time', detail: 'Team notified on critical exceptions.' },
  { value: 6, suffix: ' regions', label: 'Deployment options', detail: 'Support regional data residency needs.' },
  { value: 250, suffix: '+', label: 'Automation rules', detail: 'Built-in triggers for ops playbooks.' },
];

const personas = [
  { name: 'People Ops', title: 'HR Lead', quote: 'We went from ad-hoc spreadsheets to instant exports that finance loves.', icon: <WorkspacePremiumIcon /> },
  {
    name: 'Tech Leads',
    title: 'Engineering Manager',
    quote: 'Charts and filters answer headcount questions before they are even asked.',
    icon: <TrendingUpIcon />,
  },
  {
    name: 'Leadership',
    title: 'VP, Operations',
    quote: 'Department and growth mix are clear enough to drop straight into board updates.',
    icon: <EmojiEventsIcon />,
  },
];

const steps = [
  { title: 'Secure access', desc: 'Protected routes and login flows keep sensitive data safe from day one.', icon: <VerifiedUserIcon /> },
  { title: 'Configure teams', desc: 'Set up departments, import employees, and wire up quick actions.', icon: <ShieldIcon /> },
  { title: 'Share insights', desc: 'Use dashboards and exports to keep leadership aligned every week.', icon: <TimelineIcon /> },
];

const faqs = [
  {
    q: 'Can I export data for finance or ops reviews?',
    a: 'Yes — use the built-in exports in Employees and Departments to get a clean CSV anytime, filtered to exactly the slice you need.',
  },
  {
    q: 'Does it support remote and hybrid tracking?',
    a: 'Dashboard charts already visualize remote and hybrid preferences without any extra setup or configuration.',
  },
  { q: 'How fast can we onboard?', a: 'Most teams are running in under a day: set roles, add departments, and import employees in a single sitting.' },
  { q: 'Is access role-based?', a: 'Protected routes and role-aware surfaces mean people only see what they should, by department and seniority.' },
];

const trustedBy = ['Atlas HR', 'Northwind Ops', 'Acme Labs', 'Cobalt Systems', 'HelioCo', 'Vertex Group', 'Lumen Works'];

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
const LandingPage = () => {
  return (
    <Box sx={{ position: 'relative', width: '100%', color: TEXT, background: PAGE_BG, minHeight: '100vh' }}>
      {/* Page-wide procedural 3D — fixed behind every section, including the CTA. */}
      <HeroBackground />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <LandingHeader />

        {/* ============================ HERO ============================ */}
        <Box
          component="section"
          id="top"
          sx={{
            position: 'relative',
            minHeight: { xs: 'calc(100svh - 64px)', md: 'calc(100vh - 76px)' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 4 } }}>
            <Reveal>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.8, py: 0.8, borderRadius: 999, mb: 3, ...GLASS, boxShadow: 'none' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#34d399',
                    boxShadow: '0 0 12px #34d399',
                    animation: 'pulseDot 2s ease-in-out infinite',
                    '@keyframes pulseDot': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(0.7)' } },
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                  }}
                />
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.92)', fontWeight: 700 }}>
                  EMPLOYEE MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Reveal>

            <Reveal delay={80}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.02,
                  letterSpacing: '-0.025em',
                  fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.6rem', lg: '5rem' },
                  maxWidth: 1040,
                  textShadow: '0 2px 44px rgba(0,0,0,0.45)',
                }}
              >
                Run your workforce with{' '}
                <Box component="span" sx={gradientText()}>
                  clarity &amp; confidence
                </Box>
                .
              </Typography>
            </Reveal>

            <Reveal delay={140}>
              <Typography sx={{ mt: 3, maxWidth: 660, fontSize: { xs: '1.06rem', md: '1.3rem' }, color: TEXT2, lineHeight: 1.6 }}>
                One place for dashboards, departments, and people operations — built for teams that need insights, not spreadsheets.
              </Typography>
            </Reveal>

            <Reveal delay={200}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.8} sx={{ mt: 4, flexWrap: 'wrap', gap: 1.5 }}>
                <Button
                  component={Link}
                  to="/dashboard"
                  size="large"
                  startIcon={<SpaceDashboardIcon />}
                  sx={{
                    px: 3.6,
                    py: 1.5,
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: '#0f172a',
                    background: 'linear-gradient(135deg,#ffb74d,#ff9800)',
                    boxShadow: '0 14px 36px rgba(255,152,0,0.45)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg,#ffc163,#ffa31a)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 48px rgba(255,152,0,0.55)',
                    },
                  }}
                >
                  View Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/employees"
                  size="large"
                  variant="outlined"
                  startIcon={<PeopleAltIcon />}
                  sx={{
                    px: 3.6,
                    py: 1.5,
                    fontWeight: 700,
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.42)',
                    backdropFilter: 'blur(6px)',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.12)' },
                  }}
                >
                  Browse Directory
                </Button>
                <Button
                  onClick={() => scrollToId('operational-benchmarks')}
                  size="large"
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ px: 2, py: 1.5, fontWeight: 700, color: 'rgba(255,255,255,0.86)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}
                >
                  Learn More
                </Button>
              </Stack>
            </Reveal>

            <Reveal delay={260}>
              <Stack direction="row" sx={{ mt: 4, flexWrap: 'wrap', gap: 1.2 }}>
                {['Faster onboarding', 'Role-based access', 'Export-ready data', 'Insightful dashboards'].map(label => (
                  <Box
                    key={label}
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.6, py: 0.8, borderRadius: 2, ...GLASS, boxShadow: 'none' }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#34d399' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Reveal>

            <Reveal delay={320}>
              <Grid container spacing={2.5} sx={{ mt: 4, maxWidth: 920 }}>
                {heroStats.map(stat => (
                  <Grid item xs={12} sm={4} key={stat.label}>
                    <Box sx={{ p: 2.5, borderRadius: '18px', height: '100%', minHeight: 132, ...SURFACE }}>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, ...gradientText('linear-gradient(90deg,#ffffff,#9cc0ff)') }}>
                        <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                      </Typography>
                      <Typography variant="body2" sx={{ color: TEXT2, mt: 0.5 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Reveal>
          </Container>

          <Box
            onClick={() => scrollToId('trusted')}
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              cursor: 'pointer',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              color: 'rgba(255,255,255,0.65)',
              animation: 'heroBobble 2.4s ease-in-out infinite',
              '@keyframes heroBobble': { '0%, 100%': { transform: 'translate(-50%, 0)' }, '50%': { transform: 'translate(-50%, 8px)' } },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none', transform: 'translate(-50%, 0)' },
              '&:hover': { color: '#fff' },
            }}
          >
            <Typography variant="caption" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              SCROLL
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>
        </Box>

        {/* ===================== CONTENT SECTIONS ===================== */}
        <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, md: 4 } }}>
          {/* Trusted-by marquee */}
          <Box id="trusted" sx={{ ...sectionAnchor, py: { xs: 5, md: 7 } }}>
            <Reveal>
              <Typography sx={{ textAlign: 'center', color: TEXT3, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.78rem', mb: 3 }}>
                Trusted by teams that care about clarity
              </Typography>
            </Reveal>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  gap: 2,
                  whiteSpace: 'nowrap',
                  animation: 'marquee 32s linear infinite',
                  '@keyframes marquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
              >
                {[...trustedBy, ...trustedBy].map((name, i) => (
                  <Box
                    key={`${name}-${i}`}
                    sx={{ px: 3, py: 1.4, borderRadius: '14px', ...GLASS, boxShadow: 'none', fontWeight: 800, color: TEXT, letterSpacing: '-0.01em' }}
                  >
                    {name}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Operational benchmarks — uniform grid */}
          <Box id="operational-benchmarks" sx={{ ...sectionAnchor, ...sectionPad }}>
            <SectionHeading
              eyebrow="By the numbers"
              title="Operational benchmarks at a glance"
              subtitle="A single source of truth translates into measurable outcomes. These benchmarks reflect the operational scale the platform is designed to support."
            />
            <Grid container spacing={2.5} alignItems="stretch">
              {benchmarkStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={stat.label}>
                  <Reveal delay={(index % 3) * 70}>
                    <Card sx={cardSx(168)}>
                      <CardContent sx={{ p: { xs: 2.6, md: 3 } }}>
                        <Typography
                          sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '2.6rem' }, ...gradientText('linear-gradient(90deg,#ffffff,#9cc0ff)') }}
                        >
                          <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} format={stat.format} />
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: TEXT, mt: 0.5, fontSize: '1rem' }}>{stat.label}</Typography>
                        <Typography variant="body2" sx={{ color: TEXT3, mt: 0.5 }}>
                          {stat.detail}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" sx={{ color: TEXT3, mt: 2, display: 'block' }}>
              Benchmarks shown are illustrative.
            </Typography>
          </Box>

          {/* Features — uniform grid */}
          <Box id="features" sx={{ ...sectionAnchor, ...sectionPad }}>
            <SectionHeading
              eyebrow="Everything you need"
              title="A complete toolkit to operate smoothly"
              subtitle="From employee profiles to dashboards, every module is designed for fast decisions and confident sharing — no extra tools required."
            />
            <Grid container spacing={2.5} alignItems="stretch">
              {features.map((f, index) => (
                <Grid item xs={12} sm={6} md={4} key={f.title}>
                  <Reveal delay={(index % 3) * 70}>
                    <Card sx={{ ...cardSx(248), position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${f.from}, ${f.to})` }} />
                      <CardContent sx={{ p: { xs: 3, md: 3.4 } }}>
                        <IconBadge from={f.from} to={f.to}>
                          {f.icon}
                        </IconBadge>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: TEXT, mt: 2 }}>{f.title}</Typography>
                        <Typography sx={{ color: TEXT2, mt: 1, lineHeight: 1.6 }}>{f.desc}</Typography>
                        {f.link && (
                          <Button
                            component={Link}
                            to={f.link}
                            endIcon={<ArrowForwardIcon />}
                            sx={{ mt: 1.5, px: 0, fontWeight: 700, color: '#8ab4ff', '&:hover': { background: 'transparent', color: '#fff' } }}
                          >
                            Open
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Platform pillars — uniform grid */}
          <Box id="platform" sx={{ ...sectionAnchor, ...sectionPad }}>
            <SectionHeading
              eyebrow="The platform"
              title="Governance, automation, and reporting"
              subtitle="Keep sensitive data protected, automate the routine, and deliver leadership-ready insights — all from one connected system."
            />
            <Grid container spacing={2.5} alignItems="stretch">
              {platformPillars.map((pillar, index) => (
                <Grid item xs={12} md={4} key={pillar.title}>
                  <Reveal delay={index * 90}>
                    <Card sx={cardSx(360)}>
                      <CardContent sx={{ p: { xs: 3, md: 3.6 } }}>
                        <IconBadge from={pillar.from} to={pillar.to} size={54}>
                          {pillar.icon}
                        </IconBadge>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: TEXT, mt: 2 }}>{pillar.title}</Typography>
                        <Typography sx={{ color: TEXT2, mt: 1, mb: 2.5, lineHeight: 1.6 }}>{pillar.desc}</Typography>
                        <Stack spacing={1.3}>
                          {pillar.items.map(item => (
                            <Stack key={item} direction="row" spacing={1.2} alignItems="flex-start">
                              <CheckCircleIcon sx={{ fontSize: 20, color: '#34d399', mt: '1px' }} />
                              <Typography sx={{ color: TEXT, fontWeight: 500 }}>{item}</Typography>
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

          {/* Workflow timeline — uniform step cards */}
          <Box id="workflow" sx={{ ...sectionAnchor, ...sectionPad }}>
            <SectionHeading
              eyebrow="How it works"
              title="Live in three focused steps"
              subtitle="Set up once, align departments, and publish insights without disrupting the team."
              center
              maxWidth={680}
            />
            <Box sx={{ position: 'relative' }}>
              <Box
                aria-hidden
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: 34, // half of the 70px circle (border-box) → centers the line
                  left: '16.66%',
                  right: '16.66%',
                  height: 2,
                  background: 'linear-gradient(90deg,#4f7cff,#7c5cff,#ff9800)',
                  opacity: 0.5,
                }}
              />
              <Grid container columnSpacing={2.5} rowSpacing={{ xs: 4, md: 0 }} alignItems="flex-start">
                {steps.map((step, index) => (
                  <Grid item xs={12} md={4} key={step.title}>
                    <Reveal delay={index * 100}>
                      <Box sx={{ textAlign: 'center', px: 2 }}>
                        <Box
                          sx={{
                            width: 70,
                            height: 70,
                            mx: 'auto',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#fff',
                            background: 'linear-gradient(135deg,#4f7cff,#7c5cff)',
                            boxShadow: '0 14px 30px rgba(79,124,255,0.5)',
                            position: 'relative',
                            border: '4px solid #0a1326',
                            '& svg': { fontSize: 30 },
                          }}
                        >
                          {step.icon}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -6,
                              right: -6,
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: '#ff9800',
                              color: '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              display: 'grid',
                              placeItems: 'center',
                              border: '2px solid #0a1326',
                            }}
                          >
                            {index + 1}
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: TEXT, mt: 2.5 }}>{step.title}</Typography>
                        <Typography sx={{ color: TEXT2, mt: 1, lineHeight: 1.6, maxWidth: 300, mx: 'auto' }}>{step.desc}</Typography>
                      </Box>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Service levels — uniform tiles */}
          <Box sx={{ ...sectionPad }}>
            <SectionHeading
              eyebrow="Service levels"
              title="Performance guardrails built for confidence"
              subtitle="Automation depth and operational coverage designed to keep your people data dependable."
              center
              maxWidth={680}
            />
            <Grid container spacing={2.5} alignItems="stretch">
              {serviceLevels.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Reveal delay={index * 70}>
                    <Card sx={cardSx(168)}>
                      <CardContent sx={{ p: { xs: 2.6, md: 3 } }}>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.3rem' }, ...gradientText('linear-gradient(90deg,#ffffff,#9cc0ff)') }}>
                          <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: TEXT, mt: 0.5 }}>{stat.label}</Typography>
                        <Typography variant="body2" sx={{ color: TEXT3, mt: 0.5 }}>
                          {stat.detail}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Personas — uniform cards */}
          <Box sx={{ ...sectionPad }}>
            <SectionHeading
              eyebrow="Who it's for"
              title="One data layer, every team aligned"
              subtitle="People leaders, engineering managers, and operations teams rely on the same trusted data to move fast and stay in sync."
            />
            <Grid container spacing={2.5} alignItems="stretch">
              {personas.map((persona, index) => (
                <Grid item xs={12} md={4} key={persona.name}>
                  <Reveal delay={index * 80}>
                    <Card sx={cardSx(240)}>
                      <CardContent sx={{ p: { xs: 3, md: 3.4 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ fontSize: '2.6rem', lineHeight: 1, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>“</Box>
                        <Typography sx={{ color: TEXT, fontSize: '1.08rem', lineHeight: 1.6, mt: -1, mb: 2.5, fontWeight: 500, flexGrow: 1 }}>
                          {persona.quote}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ background: 'linear-gradient(135deg,#1E3C72,#4f7cff)', color: '#fff', width: 46, height: 46 }}>
                            {persona.name[0]}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: TEXT }}>{persona.name}</Typography>
                            <Typography variant="caption" sx={{ color: TEXT3 }}>
                              {persona.title}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQ */}
          <Box id="faq" sx={{ ...sectionAnchor, ...sectionPad }}>
            <SectionHeading eyebrow="Questions" title="Everything teams ask before rollout" center maxWidth={680} />
            <Box sx={{ maxWidth: 860, mx: 'auto' }}>
              {faqs.map((item, index) => (
                <Reveal key={item.q} delay={index * 50}>
                  <Accordion
                    disableGutters
                    sx={{
                      mb: 1.5,
                      borderRadius: '16px !important',
                      ...SURFACE,
                      color: TEXT,
                      '&:before': { display: 'none' },
                      overflow: 'hidden',
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: TEXT2 }} />} sx={{ px: 3, py: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: TEXT, fontSize: '1.05rem' }}>{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Typography sx={{ color: TEXT2, lineHeight: 1.65 }}>{item.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Reveal>
              ))}
            </Box>
          </Box>
        </Container>

        {/* ===================== FINAL CTA (3D shows through) ===================== */}
        <Box component="section" sx={{ position: 'relative', py: { xs: 8, md: 12 } }}>
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 760,
              height: 760,
              maxWidth: '120vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,152,0,0.20), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4 } }}>
            <Reveal>
              <Box sx={{ ...SURFACE, borderRadius: '28px', p: { xs: 4, md: 7 }, textAlign: 'center' }}>
                <Eyebrow>Get started</Eyebrow>
                <Typography
                  component="h2"
                  sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' }, color: TEXT }}
                >
                  Ready to see your workforce{' '}
                  <Box component="span" sx={gradientText()}>
                    come into focus
                  </Box>
                  ?
                </Typography>
                <Typography sx={{ mt: 2.5, color: TEXT2, fontSize: { xs: '1.05rem', md: '1.2rem' }, maxWidth: 620, mx: 'auto', lineHeight: 1.6 }}>
                  Jump into the dashboard, filter employees, and ship updates without extra tooling. No spreadsheets required.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                  <Button
                    component={Link}
                    to="/dashboard"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4,
                      py: 1.6,
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#0f172a',
                      background: 'linear-gradient(135deg,#ffb74d,#ff9800)',
                      boxShadow: '0 16px 40px rgba(255,152,0,0.5)',
                      '&:hover': { background: 'linear-gradient(135deg,#ffc163,#ffa31a)', transform: 'translateY(-2px)' },
                      transition: 'all .25s ease',
                    }}
                  >
                    Open Dashboard
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    size="large"
                    variant="outlined"
                    sx={{
                      px: 4,
                      py: 1.6,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.42)',
                      '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Create account
                  </Button>
                </Stack>
                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 4, flexWrap: 'wrap', gap: 1.5, color: TEXT2 }}>
                  {['No credit card', 'Setup in under a day', 'Export-ready data'].map(point => (
                    <Stack key={point} direction="row" spacing={0.8} alignItems="center">
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#34d399' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {point}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Reveal>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
