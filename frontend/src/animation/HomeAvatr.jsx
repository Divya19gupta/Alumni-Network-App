import Lottie from 'lottie-react';
import { Box, Container, Typography, Button } from '@mui/material';
export const AvatarHome = () => {
  return (
    <Box
      sx={{
        height: '80%', 
        width: '80%',   
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Lottie
      animationData={require('/public/assets/home-avatar.json')}
      loop
      style={{ height: '100%', width: '100%' }}
    />
    </Box>
  );
};