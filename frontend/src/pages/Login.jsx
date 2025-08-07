import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { setAuthToken } from '../utils/api';

/**
 * A simple login page that collects the user's email and password. Upon
 * successful authentication, it stores the returned token and redirects
 * the user to the dashboard. Any errors returned from the server are
 * displayed below the form.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });
      const { token } = res.data;
      login(token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.'
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
          Giriş Yap
        </Typography>
        {error && (
          <Typography color="error" className="mb-4">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="E-posta"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Parola"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Giriş Yap
          </Button>
        </form>
        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Hesabınız yok mu?{' '}
            <Link component="button" onClick={() => navigate('/register')}>
              Kayıt Ol
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
