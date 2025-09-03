'use client';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

import * as React from 'react';
import { Box, Typography, Card, CardContent, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Slide } from '@mui/material';


export default function AdminPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {}
    if (!token || !user || user.email !== 'admin@diagnostic.com') {
      setError("You are not authorized to view this page. Only the admin user has access.");
      setLoading(false);
      return;
    }
    fetch('http://localhost:8080/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setUsers(data))
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  // Edit and Delete handlers
  const [editUser, setEditUser] = React.useState<any>(null);
  const [editValues, setEditValues] = React.useState<{ name: string; email: string; role: string }>({ name: '', email: '', role: '' });
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);

  function handleEdit(user: any) {
    setEditUser(user);
    setEditValues({ name: user.name, email: user.email, role: user.role });
    setEditError('');
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setEditLoading(true);
    setEditError('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`http://localhost:8080/users/${editUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editValues)
    });
    const data = await res.json();
    setEditLoading(false);
    if (res.ok && data.success) {
      setUsers(users.map(u => u.id === editUser.id ? data.user : u));
      setEditUser(null);
    } else {
      setEditError(data.error || 'Failed to update user');
    }
  }

  function handleDeleteDialog(id: string) {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteUserId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`http://localhost:8080/users/${deleteUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setUsers(users.filter(u => u.id !== deleteUserId));
      setDeleteDialogOpen(false);
      setDeleteUserId(null);
    } else {
      alert(data.error || 'Failed to delete user');
    }
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  }

  return (
    <Box sx={{ minHeight: '80vh', background: '#fff', p: 3, borderRadius: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Admin Panel</Typography>
      <Card sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>User Management</Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width={40} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="text" width={160} /></TableCell>
                      <TableCell><Skeleton variant="text" width={60} /></TableCell>
                      <TableCell align="right"><Skeleton variant="rectangular" width={80} height={32} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" onClick={() => handleEdit(user)} sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteDialog(user.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* Fancy Edit Dialog */}
          <Dialog open={!!editUser} onClose={() => setEditUser(null)} TransitionComponent={Slide} keepMounted>
            <DialogTitle>Edit User</DialogTitle>
            <form onSubmit={handleEditSubmit}>
              <DialogContent>
                <TextField
                  label="Name"
                  value={editValues.name}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={editValues.email}
                  onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editValues.role}
                    label="Role"
                    onChange={e => setEditValues({ ...editValues, role: e.target.value })}
                    required
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                {editError && <Typography color="error" sx={{ mt: 1 }}>{editError}</Typography>}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditUser(null)} color="inherit">Cancel</Button>
                <Button type="submit" variant="contained" color="primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          {/* Fancy Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} TransitionComponent={Slide} keepMounted>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this user?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="inherit">Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}