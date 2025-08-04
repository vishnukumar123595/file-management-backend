
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  Box,
  IconButton,
  Button,
} from '@mui/material';

type Props = {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
};

const Navbar = ({
  darkMode,
  toggleTheme,
}: Props) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header
      className="navbar"
      style={{
        backgroundColor: darkMode ? '#2c2c2c' : '#fff',
        color: darkMode ? '#f1f1f1' : '#1a1a1a',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {/* <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton> */}
        <h2 className="logo-text">Dezign Shark</h2>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <IconButton className="theme-btn" onClick={toggleTheme}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="outlined"
          color="error"
        >
          
        </Button>
      </Box>
    </header>
  );
};

export default Navbar;
