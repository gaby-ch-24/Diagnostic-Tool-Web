'use client';
import * as React from 'react';
import { Box, Typography, Card, CardContent, Divider, Switch, FormControlLabel, Avatar, Button, TextField, Alert, CircularProgress, Skeleton } from '@mui/material';

export default function Settings() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState("");
  const [avatarSuccess, setAvatarSuccess] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [pwError, setPwError] = React.useState("");
  const [pwSuccess, setPwSuccess] = React.useState("");
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    fetch('http://localhost:8080/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data));
  }, []);

  const handleAvatarChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvatarError("");
    setAvatarSuccess("");
    if (!avatarFile) return setAvatarError("No file selected");
    if (!avatarFile.type.startsWith('image/')) return setAvatarError("File must be an image");
    if (avatarFile.size > 2 * 1024 * 1024) return setAvatarError("Image must be less than 2MB");
    setAvatarUploading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatar = reader.result;
      const res = await fetch('http://localhost:8080/change-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatar })
      });
      setAvatarUploading(false);
      if (res.ok) {
        setAvatarSuccess('Avatar updated!');
        fetch('http://localhost:8080/me', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.ok ? res.json() : null)
          .then(data => setUser(data));
        // Notify AppShell to refresh avatar
        window.dispatchEvent(new Event('avatarChanged'));
      } else {
        setAvatarError('Failed to update avatar');
      }
    };
    reader.readAsDataURL(avatarFile);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!password || !password2) return setPwError("Fill both fields");
    if (password.length < 6) return setPwError("Password must be at least 6 characters");
    if (password !== password2) return setPwError("Passwords do not match");
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch('http://localhost:8080/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password, password2 })
    });
    if (res.ok) {
      setPwSuccess('Password changed!');
    } else {
      const data = await res.json();
      setPwError(data.error || 'Failed to change password');
    }
  };

  return (
  <Box sx={{ minHeight: '80vh', background: '#fff', p: 3, borderRadius: 0 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Settings</Typography>
  <Card sx={{ maxWidth: 480, mx: 'auto', borderRadius: 0, boxShadow: 0, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Appearance</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={darkMode} onChange={e=>setDarkMode(e.target.checked)} />} label="Dark Mode" />
        </CardContent>
      </Card>
  <Card sx={{ maxWidth: 480, mx: 'auto', borderRadius: 0, boxShadow: 0, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Account</Typography>
          <Divider sx={{ mb: 2 }} />
          {!user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
                <Skeleton variant="rectangular" width={120} height={40} />
              </Box>
              <Skeleton variant="text" width={180} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={120} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} sx={{ width: 64, height: 64, mr: 2 }} />
                <form onSubmit={handleAvatarChange}>
                  <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
                  <Button type="submit" variant="contained" size="small" sx={{ ml: 1 }} disabled={avatarUploading}>Change</Button>
                </form>
              </Box>
              {avatarError && <Alert severity="error" sx={{ mb: 1 }}>{avatarError}</Alert>}
              {avatarSuccess && <Alert severity="success" sx={{ mb: 1 }}>{avatarSuccess}</Alert>}
              <Typography>Email: {user.email}</Typography>
              <Typography sx={{ mt: 1 }}>Role: {user.role}</Typography>
            </>
          )}
        </CardContent>
      </Card>
  <Card sx={{ maxWidth: 480, mx: 'auto', borderRadius: 0, boxShadow: 0 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Change Password</Typography>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handlePasswordChange}>
            <TextField label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" />
            <TextField label="Confirm Password" type="password" value={password2} onChange={e => setPassword2(e.target.value)} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Change Password</Button>
          </form>
          {pwError && <Alert severity="error" sx={{ mt: 2 }}>{pwError}</Alert>}
          {pwSuccess && <Alert severity="success" sx={{ mt: 2 }}>{pwSuccess}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}
