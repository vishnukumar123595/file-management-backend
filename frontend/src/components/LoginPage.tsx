import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Container,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images1.jpeg'; // ✅ your background image

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        data
      );

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);

      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      setErrorMsg(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            textTransform="uppercase"
            fontWeight={700}
            gutterBottom
          >
            Dezign Shark
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            letterSpacing={5}
            gutterBottom
          >
            ALL ABOUT DESIGN
          </Typography>

          <Box mt={3}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Welcome back
            </Typography>
            <Typography variant="body2">
              Please enter your login details to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: '#fff' }}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Grid container justifyContent="flex-end" mt={1}>
              <Typography
                variant="body2"
                sx={{ color: '#ddd', cursor: 'pointer' }}
              >
                Forgot password?
              </Typography>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, borderRadius: 3 }}
            >
              Login
            </Button>

            {errorMsg && (
              <Typography color="error" mt={2}>
                {errorMsg}
              </Typography>
            )}
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
