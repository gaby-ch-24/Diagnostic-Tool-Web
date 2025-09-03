'use client';
import * as React from 'react';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { AppShell } from '../components/AppShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? 'dark' : 'light' },
        shape: { borderRadius: 16 },
      }),
    [darkMode]
  );
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppShell darkMode={darkMode} setDarkMode={setDarkMode}>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
