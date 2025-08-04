
// src/AdminDashboard/Sidebar.tsx
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const sidebarItems = [
  'All files',
  'Brochures',
  'Offline Marketing',
  'Reels',
  'Static Posts',
  "LOGO's",
  'Websites',
];

type Props = {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
};

const Sidebar = ({ open, onClose, darkMode }: Props) => {
  const [active, setActive] = useState('All files');

  return (
    <aside
      className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Menu</h3>
        <button className="close-btn" onClick={onClose}>
          <CloseIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </button>
      </div>

      {sidebarItems.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`sidebar-item ${active === item ? 'active' : ''}`}
        >
          {item}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
