
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Folder, Share, ArrowBack } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import axios from 'axios';
import FileManager from './FileList';

type FolderType = {
  _id: string;
  name: string;
  createdBy: string;
  totalFiles?: number;
};

const UserDashboard: React.FC = () => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'folders' | 'files'>('folders');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [trashView, setTrashView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const token = localStorage.getItem('token');

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
      fetchFolders();
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
    handleClearSearch();
  };

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
          {/* TrashManager component can go here */}
        </Box>
      );
    }

    if (viewMode === 'folders') {
      return (
        <Box className="folder-section" >
          <Box className="folder-header"  display="flex" justifyContent="space-between" alignItems="center" mb={3} backgroundColor="#1f1e1eff" padding={2} borderRadius={2}>
            <Typography variant="h5" fontWeight="bold" color='white'>Folders</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <IconButton color="primary" title="Share">
                <Share />
              </IconButton>
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
                    {/* <Delete fontSize="inherit" style={{ color: 'red' }} /> */}
                  </IconButton>
                  <Folder className="folder-icon" />
                  
                  <Typography className="folder-name">{folder.name}</Typography>
                  <Typography variant="caption" style={{ color: '#fff' }}>
                    Total Items: {folder.totalFiles ?? 0}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      );
    }

    // ViewMode === 'files'
    return (
      <Box className="file-manager-section">
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={handleBackToFolders}>
            <ArrowBack style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" ml={1}>Files in Folder</Typography>
        </Box>

        {selectedFolderId && (
          <FileManager
            folderId={selectedFolderId}
            searchTerm={searchTerm}
            searchResults={
              searchTerm && viewMode === 'files' ? { files: searchResults } : undefined
            }
          />
        )}
      </Box>
    );
  };

  return (
    <DashboardLayout
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      onClearSearch={handleClearSearch}
    >
      {renderMainContent()}
    </DashboardLayout>
  );
};

export default UserDashboard;
