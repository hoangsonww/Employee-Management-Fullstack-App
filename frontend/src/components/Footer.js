import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
        color: 'white',
        padding: '2.5rem 0',
        marginTop: '2rem',
        boxShadow: '0 -12px 35px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 220,
          height: 220,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 55%)',
          top: -60,
          right: -40,
          filter: 'blur(2px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 55%)',
          bottom: -40,
          left: -30,
          filter: 'blur(2px)',
        }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              About Us
            </Typography>
            <Typography variant="body2">
              We provide a comprehensive Employee Management System that helps you manage your employees and departments with ease. Our mission is to make HR
              processes seamless and efficient.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Home
              </Link>
              <Link href="/dashboard" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Dashboard
              </Link>
              <Link href="/employees" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Employees
              </Link>
              <Link href="/departments" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Departments
              </Link>
              <Link href="/profile" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Profile
              </Link>
              <Link href="/login" color="inherit" underline="none" sx={{ display: 'block', marginBottom: '0.5rem', '&:hover': { color: '#f57c00' } }}>
                Login
              </Link>
              <Link href="/register" color="inherit" underline="none" sx={{ display: 'block', '&:hover': { color: '#f57c00' } }}>
                Register
              </Link>
            </Box>
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Project Maintainer:{' '}
              <Link href="https://github.com/hoangsonww" color="inherit" sx={{ textDecoration: 'underline', '&:hover': { color: '#f57c00' } }}>
                Son Nguyen
              </Link>
            </Typography>
            <Typography variant="body2">
              Email:{' '}
              <Link href="mailto:hoangson091104@gmail.com" color="inherit" sx={{ textDecoration: 'underline', '&:hover': { color: '#f57c00' } }}>
                hoangson091104@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2">Phone: +1 (123) 456-7890</Typography>
            <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
              Address: 123 Employee St, Suite 100, New York, NY 10001
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '2rem',
            paddingTop: '1rem',
          }}
        >
          <Typography variant="body2">© {new Date().getFullYear()} Employee Management System. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
