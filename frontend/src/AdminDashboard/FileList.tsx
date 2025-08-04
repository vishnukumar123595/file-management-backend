
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
  TextField,
  Modal
} from '@mui/material';
import { Delete, Edit, Share, Add, Close } from '@mui/icons-material';
import axios from 'axios';
// import debounce from 'lodash.debounce';
import debounce from 'lodash.debounce';

type FileType = {
  _id: string;
  name: string;
  size: string;
  folderId: string;
};

interface FileManagerProps {
  folderId: string;
  searchTerm: string;
  searchResults?: { files: FileType[] };
}

const FileManager: React.FC<FileManagerProps> = ({
  folderId,
  searchResults,
}) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [shareUserId, setShareUserId] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const folderFiles = data.filter((file: FileType) => file.folderId === folderId);
      setFiles(folderFiles);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
    }
  }, [folderId, token]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFiles();
    } catch (err) {
      console.error('File delete failed:', err);
    }
  };

  const handleAddFile = async () => {
    if (!newFileName.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/files`, {
        name: newFileName,
        folderId,
        size: '1 MB',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSidebar(false);
      setNewFileName('');
      fetchFiles();
    } catch (err) {
      console.error('File creation failed:', err);
    }
  };

  const handleUpdateFileName = async (fileId: string) => {
    if (!editingName.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/files/share`, {
        fileId,
        newName: editingName,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingFileId(null);
      setEditingName('');
      fetchFiles();
    } catch (err) {
      console.error('Rename failed:', err);
    }
  };

  const handleShareFile = async () => {
    if (!shareUserId.trim() || !shareFileId) return;

    setShareLoading(true);
    setShareError(null);
    setShareSuccess(null);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/files/share`, {
        fileId: shareFileId,
        userId: shareUserId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShareSuccess('File shared successfully!');
      fetchFiles();
      setTimeout(() => {
        setShareFileId(null);
        setShareUserId('');
        setShareSuccess(null);
      }, 2000);
    } catch (err) {
      setShareError('Failed to share file. Check user ID and try again.');
    } finally {
      setShareLoading(false);
    }
  };

  const filesToRender = useMemo(() => {
    return (searchResults?.files ?? files).filter(file => file.folderId === folderId);
  }, [files, folderId, searchResults]);

  // Debounced name change (optional enhancement if you later use auto-save on typing)
  const debouncedSetEditingName = useMemo(() => debounce(setEditingName, 300), []);

  useEffect(() => {
    return () => {
      debouncedSetEditingName.cancel();
    };
  }, [debouncedSetEditingName]);

  return (
    <Box position="relative">
      {/* Header */}
      <Box className="file-header" display="flex" justifyContent="space-between" alignItems="center" mb={3} bgcolor="#1f1e1eff" p={2} borderRadius={2}>
        <Typography variant="h5" fontWeight="bold">Files</Typography>
        <Box display="flex" gap={2}>
          <IconButton color="primary" title="Share"><Share /></IconButton>
          <Button variant="contained" color="error" startIcon={<Add />} onClick={() => setShowSidebar(true)}>
            Add File
          </Button>
        </Box>
      </Box>

      {/* File List */}
      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : files.length === 0 ? (
        <Typography mt={4} textAlign="center" color="gray">
          No files in this folder. Click "Add File" to upload one.
        </Typography>
      ) : (
        <Box className="folder-grid">
          {filesToRender.map((file) => (
            <Box
              key={file._id}
              className="folder-card"
              sx={{
                position: 'relative',
                p: 2,
                border: '1px solid grey',
                borderRadius: 4,
                bgcolor: '#1f1e1eff',
                '&:hover .file-action-icons': { display: 'flex' },
              }}
            >
              <Box
                className="file-action-icons"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'none',
                }}
              >
                <Tooltip title="Share file">
                  <IconButton size="small" sx={{ color: 'white' }} onClick={() => setShareFileId(file._id)}>
                    <Share fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" sx={{ color: 'white' }} onClick={() => {
                    setEditingFileId(file._id);
                    setEditingName(file.name);
                  }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" sx={{ color: 'red' }} onClick={() => handleDelete(file._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* File Info */}
              {editingFileId === file._id ? (
                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    size="small"
                    value={editingName}
                    onChange={(e) => debouncedSetEditingName(e.target.value)}
                    autoFocus
                  />
                  <Button size="small" onClick={() => handleUpdateFileName(file._id)}>Save</Button>
                </Box>
              ) : (
                <>
                  <Typography fontWeight="bold" sx={{ color: 'white' }}>{file.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'white' }}>Size: {file.size}</Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Share Modal */}
      <Modal open={!!shareFileId} onClose={() => {
        setShareFileId(null);
        setShareUserId('');
        setShareError(null);
        setShareSuccess(null);
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>Share File</Typography>
          <TextField
            label="User ID to share with"
            value={shareUserId}
            onChange={(e) => setShareUserId(e.target.value)}
            fullWidth
            margin="normal"
            disabled={shareLoading}
          />
          {shareError && <Typography color="error" variant="body2" mt={1}>{shareError}</Typography>}
          {shareSuccess && <Typography color="success.main" variant="body2" mt={1}>{shareSuccess}</Typography>}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setShareFileId(null)} disabled={shareLoading}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleShareFile}
              disabled={!shareUserId.trim() || shareLoading}
            >
              {shareLoading ? <CircularProgress size={24} /> : 'Share'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add File Sidebar */}
      {showSidebar && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 320,
            height: '100%',
            bgcolor: '#1f1e1eff',
            p: 3,
            boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            borderTop: '4px solid red',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: 'white' }}>Add File</Typography>
            <IconButton onClick={() => setShowSidebar(false)}><Close sx={{ color: 'white' }} /></IconButton>
          </Box>
          <TextField
            sx={{ backgroundColor: '#2a2a2a', input: { color: 'white' } }}
            label="File Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box mt="auto" display="flex" justifyContent="space-between">
            <Button onClick={() => setShowSidebar(false)} sx={{ color: 'grey', backgroundColor: 'white' }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: 'red', color: 'white' }} onClick={handleAddFile} disabled={!newFileName.trim()}>
              Add File
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileManager;
