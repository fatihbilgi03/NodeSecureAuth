import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import api, { setAuthToken } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * The main dashboard displayed after login. It shows a list of items,
 * existing assignments and allows admins to create items and assign
 * items to users. Only admins see the forms for adding items and making
 * assignments.
 */
export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
  });
  const [assignmentForm, setAssignmentForm] = useState({
    userId: '',
    itemId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch initial data once a token is available.
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchData = async () => {
    try {
      // Attempt to fetch all items, users and assignments concurrently.
      // Some endpoints may not exist depending on the backend implementation.
      const [itemsRes, usersRes, assignRes] = await Promise.all([
        // Items endpoint may not be implemented on the backend. In case of failure,
        // it will fall back to an empty array.
        api.get('/items').catch(() => ({ data: [] })),
        api.get('/users'),
        api.get('/useritems'),
      ]);
      setItems(itemsRes.data || []);
      setUsers(usersRes.data?.users || []);
      setAssignments(assignRes.data || []);
    } catch (err) {
      console.error('Veriler alınırken hata oluştu:', err);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newItem.name.trim()) {
      setError('Ürün adı (name) zorunlu.');
      return;
    }
    try {
      await api.post('/items', {
        name: newItem.name.trim(),
        description: newItem.description.trim(),
      });
      setSuccess('Item başarıyla oluşturuldu.');
      setNewItem({ name: '', description: '' });
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Item oluşturulamadı. Lütfen bilgilerinizi kontrol edin.'
      );
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!assignmentForm.userId || !assignmentForm.itemId) {
      setError('Atama için kullanıcı ve item seçilmelidir.');
      return;
    }
    try {
      const res = await api.post('/useritems', assignmentForm);
      setSuccess(res.data?.message || 'Atama başarıyla yapıldı.');
      setAssignmentForm({ userId: '', itemId: '' });
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Atama yapılamadı. Lütfen aynı itemı birden fazla kez atamadığınıza emin olun.'
      );
    }
  };

  const handleRemoveAssignment = async (itemId, userId) => {
    try {
      await api.delete(`/useritems/items/${itemId}/assign/${userId}`);
      fetchData();
    } catch (err) {
      console.error('Atama kaldırılırken hata oluştu:', err);
    }
  };

  return (
    <Container className="py-10">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4">Gösterge Paneli</Typography>
        <Button variant="outlined" onClick={logout}>
          Çıkış Yap
        </Button>
      </Box>

      {user?.role === 'admin' && (
        <Box className="mb-8">
          <Typography variant="h5" gutterBottom>
            Yeni Item Oluştur
          </Typography>
          <form onSubmit={handleCreateItem} className="flex gap-4 flex-wrap">
            <TextField
              label="Ad"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <TextField
              label="Açıklama"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
            <Button variant="contained" type="submit">
              Oluştur
            </Button>
          </form>
        </Box>
      )}

      {user?.role === 'admin' && (
        <Box className="mb-8">
          <Typography variant="h5" gutterBottom>
            Item Atama
          </Typography>
          <form onSubmit={handleAssign} className="flex gap-4 flex-wrap">
            <TextField
              select
              label="Kullanıcı"
              value={assignmentForm.userId}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, userId: e.target.value })
              }
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.username}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Item"
              value={assignmentForm.itemId}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, itemId: e.target.value })
              }
            >
              {items.map((i) => (
                <MenuItem key={i._id} value={i._id}>
                  {i.name}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" type="submit">
              Ata
            </Button>
          </form>
        </Box>
      )}

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" gutterBottom>
          {success}
        </Typography>
      )}

      <Box className="mt-10">
        <Typography variant="h5" gutterBottom>
          Item Listesi
        </Typography>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  {item.description && (
                    <Typography variant="body2" className="mb-2">
                      {item.description}
                    </Typography>
                  )}
                  <Typography variant="caption">
                    Sahip ID: {item.userId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="mt-10">
        <Typography variant="h5" gutterBottom>
          Atamalar
        </Typography>
        {assignments.map((assign) => (
          <Box
            key={assign._id}
            className="border p-4 mb-2 rounded-lg flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <Typography variant="body1">
                <strong>Item:</strong> {assign.itemId?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Kullanıcı:</strong> {assign.userId?.username}
              </Typography>
              <Typography variant="caption">
                Atayan ID: {assign.createdBy}
              </Typography>
            </div>
            {user?.role === 'admin' && (
              <Button
                color="error"
                onClick={() =>
                  handleRemoveAssignment(assign.itemId?._id, assign.userId?._id)
                }
              >
                Kaldır
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
