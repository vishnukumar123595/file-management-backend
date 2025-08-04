
// src/AdminDashboard/DashboardLayout.tsx
import { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
};

const DashboardLayout = ({ children, onSearchChange, onClearSearch }: Props) => {
  // const [isSi setIsSidebarOpen] = useState(true); // Sidebar default open
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : 'var(--color-bg)';
    document.body.style.color = darkMode ? '#f1f1f1' : 'var(--color-text)';
  }, [darkMode]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Full-width Navbar at top */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} onSearchChange={onSearchChange} onClearSearch={onClearSearch} onLogout={() => {
        localStorage.removeItem('token');
        // Redirect to login or reload page
        window.location.href = '/';
      }} />

      {/* Sidebar + Main Content in row, below Navbar */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* {isSidebarOpen && (
          <Sidebar onClose={() => setIsSidebarOpen(false)} darkMode={darkMode} />
        )} */}
        {/* <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> */}
        <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;