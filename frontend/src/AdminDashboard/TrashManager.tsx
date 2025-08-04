import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Button, CircularProgress, Tooltip,
} from '@mui/material';
import { Restore, DeleteForever, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

type Item = {
  _id: string;
  name: string;
  type: 'file' | 'folder';
  deletedAt?: string;
};

const TrashManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');



  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (item: Item) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${item.type}s/${item._id}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTrash();
  };

  const handlePermanentDelete = async (item: Item) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/${item.type}s/${item._id}/permanent`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTrash();
  };


  const fetchTrash = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/files?deleted=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // You are only handling files for now, so mark them with type = 'file'
    const deletedFiles = response.data.map((file: any) => ({
      ...file,
      type: 'file', // required for restore/delete logic
    }));

    setItems(deletedFiles);
  } catch (err) {
    console.error('Failed to fetch trash files:', err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Box>
      
      <Typography variant="h5" mb={3}>Trash Bin</Typography>

      {loading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Typography>No items in trash.</Typography>
      ) : (
        <Box className="folder-grid">
          {items.map(item => (
            <Box key={item._id} className="folder-card"
              sx={{ position: 'relative', p: 2, border: '1px solid #ddd', borderRadius: 4, backgroundColor: '#2a2a2a', color: 'white' }}>
              <Typography fontWeight="bold">{item.name}</Typography>

              <Box sx={{
                position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1,
              }}>
                <Tooltip title="Restore">
                  <IconButton size="small" onClick={() => handleRestore(item)}>
                    <Restore fontSize="medium" style={{ color: 'white' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Permanently">
                  <IconButton size="medium" style={{ color: 'red' }} onClick={() => handlePermanentDelete(item)}>
                    <DeleteForever fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TrashManager;
