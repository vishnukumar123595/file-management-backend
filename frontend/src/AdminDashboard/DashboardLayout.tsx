
// src/AdminDashboard/DashboardLayout.tsx
import { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
};

const DashboardLayout = ({
  children,
  onSearchChange,
  onClearSearch,
}: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : 'var(--color-bg)';
    document.body.style.color = darkMode ? '#f1f1f1' : 'var(--color-text)';
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onSearchChange={onSearchChange}
        onClearSearch={onClearSearch}
        onLogout={handleLogout}
      />

      {/* Sidebar + Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          darkMode={darkMode}
          
        />
        <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
