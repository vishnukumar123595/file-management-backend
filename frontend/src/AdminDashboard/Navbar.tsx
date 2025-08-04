import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
};

const Navbar = ({
  toggleSidebar,
  darkMode,
  toggleTheme,
  searchTerm,
  onSearchChange,
  onClearSearch,
}: Props) => {
 const [localSearch, setLocalSearch] = useState(searchTerm);
  // Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400); // adjust delay as needed

    return () => clearTimeout(delayDebounce);
  }, [localSearch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header
      className="navbar"
      style={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton>
        <h2 className="logo-text">Dezign Shark</h2>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <TextField style={{border: darkMode ? '1px solid white' : '1px solid black', borderRadius: '.6rem'}}
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setLocalSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: darkMode ? '#fff' : '#000' }} />
              </InputAdornment>
            ),
            endAdornment: localSearch && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => {
                    setLocalSearch('');
                    onClearSearch();
                  }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton className="theme-btn" onClick={toggleTheme}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button style={{border: '1px solid grey', borderRadius: '.6rem'}}
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
