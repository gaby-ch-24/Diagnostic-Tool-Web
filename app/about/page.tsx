'use client';
import * as React from 'react';
import { Box, Typography, Card, CardContent, Fade } from '@mui/material';

export default function About() {
  return (
    <Fade in timeout={800}>
  <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
        <Typography variant="h3" fontWeight={900} sx={{ mb: 3, color: '#fff', textShadow: '0 2px 16px #6366f1' }}>About Adon Technologies</Typography>
  <Card sx={{ maxWidth: 720, mx: 'auto', background: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#6366f1' }}>Adon Technologies</Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151' }}>
              Adon Technologies is a leader in innovative web solutions, specializing in diagnostic tools, cloud platforms, and digital transformation. Our mission is to empower businesses with cutting-edge technology, seamless user experiences, and robust analytics.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#6366f1' }}>
              Diagnostic Suite Pro is part of our suite, offering advanced link scanning, monitoring, and reporting for modern web applications. Built with Next.js and Material UI, it delivers real-time dashboards, scan management, and actionable insights.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version 1.0.0 &copy; 2025 Adon Technologies
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
}
