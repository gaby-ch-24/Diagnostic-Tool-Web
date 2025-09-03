"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Alert, Link as MuiLink, CircularProgress, Paper } from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("User logged in successfully!");
      setTimeout(() => router.push("/"), 1200);
    } else {
      setError(data.error || "Login failed");
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <Paper elevation={6} sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 8px 32px rgba(90,90,200,0.08)' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="#222">Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required margin="normal" variant="filled" InputProps={{ style: { background: '#f3f4f6', color: '#222' } }} />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required margin="normal" variant="filled" InputProps={{ style: { background: '#f3f4f6', color: '#222' } }} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 18 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box mt={3} textAlign="center">
          <MuiLink component={Link} href="/register" underline="hover" color="primary">Don't have an account? Register</MuiLink>
        </Box>
      </Paper>
    </Box>
  );
}
