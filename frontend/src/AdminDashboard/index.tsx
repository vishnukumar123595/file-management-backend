
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Folder, Add, Share, Delete, ArrowBack } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import FileManager from './FileList';
import TrashManager from './TrashManager'; // ⬅️ Import trash view
import axios from 'axios';
// import Navbar from './Navbar';
type FolderType = {
  _id: string;
  name: string;
  createdBy: string;
  totalFiles?: number;
};

const AdminDashboard: React.FC = () => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'folders' | 'files'>('folders');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [trashView, setTrashView] = useState(false); // ⬅️ View for trash toggle
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState<any[]>([]);

  const token = localStorage.getItem('token');


type Props = {
  folderId: string;
  searchResults?: any[] | null;
};


  const handleSearchChange = async (term: string) => {
  setSearchTerm(term);
  if (!term) {
    setSearchResults([]);
    return;
  }

  try {

    let endpoint = '';

    if (viewMode === 'folders') {
      endpoint = `${import.meta.env.VITE_API_BASE_URL}/folders/search?q=${term}`;
    } else if (viewMode === 'files' && selectedFolderId) {
      endpoint = `${import.meta.env.VITE_API_BASE_URL}/search?q=${term}&folderId=${selectedFolderId}`;
    }
  

    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSearchResults(res.data || []);
  } catch (err) {
    console.error('Search failed', err);
  }
};


const handleClearSearch = () => {
  setSearchTerm('');
  setSearchResults([]);
};
  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/folders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFolders(response.data);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!trashView) {
      fetchFolders(); // ⬅️ Avoid folder fetch when in trash
    }
  }, [trashView]);

  const handleDeleteFolder = async (folderId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this folder?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFolders();
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setViewMode('files');
  };

  const handleBackToFolders = () => {
    setSelectedFolderId(null);
    setViewMode('folders');
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/folders`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFolders();
    } catch (error) {
      console.error('Folder creation failed:', error);
    }
  };

  // 🔁 Conditional render logic
  const renderMainContent = () => {
    if (trashView) {
      return (
        <Box className="trash-section">
          <Box className="folder-header">
            <Typography variant="h5" fontWeight="bold">Trash</Typography>
            <Button variant="outlined" onClick={() => setTrashView(false)}>
              Back to Folders
            </Button>
          </Box>
          <TrashManager />
        </Box>
      );
    }

    if (viewMode === 'folders') {
      return (
        <Box className="folder-section" >
          <Box className="folder-header" backgroundColor="#1f1e1eff" padding={2} borderRadius={4}>
            <Typography variant="h5" fontWeight="bold" style={{ color: 'white' }} >Folders</Typography>
            <Box display="flex" justifyContent="space-around" gap={2} flexWrap="wrap">
              <IconButton color="primary" title="Share">
                <Share />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setTrashView(true)}
              >
                Trash
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Add />}
                onClick={handleCreateFolder}
              >
                Create Folder
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box textAlign="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : folders.length === 0 ? (
            <Typography mt={4} textAlign="center" color="gray">
              No folders found. Click "Create Folder" to begin.
            </Typography>
          ) : (
            <Box className="folder-grid">
              {(searchTerm ? searchResults : folders).map((folder) => (
                <Box
                  key={folder._id}
                  className="folder-card"
                  sx={{
                    position: 'relative',
                    padding: 2,
                    border: '1px solid grey',
                    borderRadius: 4,
                    backgroundColor: '#1f1e1eff',
                    cursor: 'pointer',
                    '&:hover .delete-icon-button': {
                      display: 'inline-flex',
                    },
                  }}
                  onClick={() => handleFolderClick(folder._id)}
                >
                  <IconButton
                    size="small"
                    className="delete-icon-button"
                    sx={{
                      display: 'none',
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder._id);
                    }}
                  >
                    <Delete fontSize="medium" style={{ color:'red'}} />
                  </IconButton>
                  <Folder className="folder-icon" />
                  <Typography className="folder-name">{folder.name}</Typography>
                  <Typography variant="caption" style={{ color: 'white' }}>
                    Total Items: {folder.totalFiles ?? 0}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box className="file-manager-section">
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={handleBackToFolders}>
            <ArrowBack style={{ color: 'grey' }} />
          </IconButton>
          <Typography variant="h6" ml={1}>Files in Folder</Typography>
        </Box>
        {selectedFolderId && <FileManager folderId={selectedFolderId} searchResults={viewMode === 'files' ? searchResults : undefined}/>}
      </Box>
    );
  };

  return <DashboardLayout searchTerm={searchTerm} onSearchChange={handleSearchChange} onClearSearch={handleClearSearch}>{renderMainContent()}</DashboardLayout>;
};

export default AdminDashboard;
