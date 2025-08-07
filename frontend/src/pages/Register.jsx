import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  MenuItem,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

/**
 * Registration page for new users. Collects username, email, password and role
 * information, then sends it to the backend. On successful registration
 * the user is redirected back to the login page.
 */
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.'
      );
    }
  };

  return (
    <Container
      maxWidth="sm"
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <Box className="w-full p-8 bg-white shadow-lg rounded-lg">
        <Typography variant="h4" align="center" gutterBottom>
          Kayıt Ol
        </Typography>
        {error && (
          <Typography color="error" className="mb-4">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Kullanıcı Adı"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            label="E-posta"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Parola"
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            select
            label="Rol"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="user">Kullanıcı</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button variant="contained" type="submit">
            Kayıt Ol
          </Button>
        </form>
        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Zaten bir hesabınız var mı?{' '}
            <Link component="button" onClick={() => navigate('/login')}>
              Giriş Yap
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
