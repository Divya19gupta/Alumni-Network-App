import React, { useEffect, useState } from 'react';
import UserLayout from '../../layout/UserLayout';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { registerUser, loginUser } from '../../config/redux/action/authAction';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  maxWidth: 1000, // reduced width
  width: '100%',
}));

const LeftCard = styled(Box)({
  flex: 1,
  backgroundColor: '#f0f8e2', // light olive cream
  padding: '3rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '1rem',
});

const RightCard = styled(Box)({
  flex: 1,
  background: '#6a760c', // soft olive gradient
  color: '#ecfad9ff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '3rem',
});

export default function LoginComponent() {
  const [showRegister, setShowRegister] = useState(false);
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (authState.isSuccess && authState.isRegistered) {
    // Registration success → redirect to login
    setShowRegister(false);
    router.push('/login');
  }
  else if (authState.isSuccess && !authState.isRegistered) {
    // Login success → redirect to dashboard
    router.push('/dashboard');
  }
}, [authState.isSuccess, authState.loggedIn, showRegister, router]);

useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  },[]);


  const handleRegistraion = () => {
    setShowRegister(false);
    dispatch(registerUser({ name, email, password, username }));
  }
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  }

  const inputStyles = {
    input: { color: '#3a4a12' },
    fieldset: { borderColor: '#a3b200' },
    '&:hover fieldset': { borderColor: '#859600' },
    '&.Mui-focused fieldset': { borderColor: '#5a6e00' },
    backgroundColor: 'white',
    borderRadius: 2,
  };

  return (
    <UserLayout>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white', // very light olive background
          py: 5,
        }}
      >
        <Card>
          {/* Left: Form */}
          <LeftCard>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {showRegister ? <PersonAddIcon sx={{ fontSize: 60, color: '#859600' }} /> : <LoginIcon sx={{ fontSize: 60, color: '#859600' }} />}
              <Typography variant="h5" sx={{ mt: 2, color: '#3a4a12', fontWeight: 600 }}>
                {showRegister ? 'Register' : 'Sign In'}
              </Typography>
            </Box>
            {authState.isError && (<div style={{backgroundColor:'#facfc7ff', borderRadius:10, padding:5, margin:5}}>      
                <Typography
                sx={{
                color:'red', 
                textAlign:'center', 
                m:2,
                fontWeight:600}}>
                    {authState.message.message}
                </Typography>
            </div>)}
            {authState.isSuccess && (<div style={{backgroundColor:'#c1f9caff', borderRadius:10, padding:5, margin:5}}>
            
                <Typography
                sx={{
                color:'green', 
                textAlign:'center', 
                m:2,
                fontWeight:600}}>
                    {authState.message.message}
                </Typography>
            </div>)}
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {showRegister && (
                <>
                <FormControl>
                  <FormLabel htmlFor="username" sx={{ color: '#3a4a12' }}>
                    Username
                  </FormLabel>
                
                  <TextField id="username" placeholder="doejohn" fullWidth variant="outlined" sx={inputStyles}
                  onChange={(e)=>{setUsername(e.target.value)}} />
                 </FormControl>
                 <FormControl>
                  <FormLabel htmlFor="name" sx={{ color: '#3a4a12' }}>
                    Name
                  </FormLabel>
                  <TextField id="name" placeholder="John Doe" fullWidth variant="outlined" sx={inputStyles} 
                  onChange={(e)=>{setName(e.target.value)}}/>
                
                </FormControl>
                </>
              )}
              <FormControl>
                <FormLabel htmlFor="email" sx={{ color: '#3a4a12' }}>
                  Email
                </FormLabel>
                <TextField
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  fullWidth
                  variant="outlined"
                  sx={inputStyles}
                  onChange={(e)=>{setEmail(e.target.value)}}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password" sx={{ color: '#3a4a12' }}>
                  Password
                </FormLabel>
                <TextField
                  id="password"
                  type="password"
                  placeholder="••••••"
                  required
                  fullWidth
                  variant="outlined"
                  sx={inputStyles}
                  onChange={(e)=>{setPassword(e.target.value)}}
                />
              </FormControl>
              <Button
                type="button"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 10,
                  backgroundColor: '#a3b200',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#859600' },
                  mt: 2,
                }}
                onClick={() => {
                        if(!showRegister){
                            handleLogin();
                        }
                        else {
                            handleRegistraion();
                        }
                    }
                }
              >
                {showRegister ? 'Sign Up' : 'Sign In'}

              </Button>
              <Button
                variant="text"
                sx={{ mt: 1, color: '#3a4a12' }}
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </Button>
            </Box>
          </LeftCard>

          {/* Right: Info / aesthetic side */}
          <RightCard>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Welcome to OliveHub
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Explore your dashboard, manage your tasks, and stay organized. Our tools help you streamline your workflow efficiently in a calm, fresh environment inspired by nature.
            </Typography>
          </RightCard>
        </Card>
      </Box>
    </UserLayout>
  );
}
