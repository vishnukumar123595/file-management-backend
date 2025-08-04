
import React, { useEffect, useState } from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

type FileType = {
  _id: string;
  name: string;
  size?: string;
  folderId: string;
};

interface FileManagerProps {
  folderId: string;
  searchTerm?: string;
  searchResults?: { files: FileType[] };
}

const FileManager: React.FC<FileManagerProps> = ({
  folderId,
  searchTerm,
  searchResults,
}) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchFiles = async () => {
    setLoading(true); // Ensure loading resets each time
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Raw file folderIds:', response.data.map(f => typeof f.folderId), response.data.map(f => f.folderId));
      console.log('folderId prop:', typeof folderId, folderId);


      const folderFiles = response.data.filter(

        (file: FileType) => file.folderId === folderId
      );
      setFiles(folderFiles);
      console.log('Filtered files:', folderFiles);

    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching files for folder:', folderId); // Debug log
    fetchFiles();
  }, [folderId]);


  // Use searchResults only if there's a searchTerm
  const filesToRender: FileType[] = searchTerm
    ? (searchResults?.files ?? []).filter((file) => file.folderId === folderId)
    : files;

  return (
    <Box position="relative">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} backgroundColor="#1f1e1eff" padding={2} borderRadius={2}>
        <Typography variant="h5" fontWeight="bold">
          Files
        </Typography>
      </Box>

      {/* File Grid */}
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filesToRender.length === 0 ? (
        <Typography mt={4} textAlign="center" color="gray">
          No files in this folder.
        </Typography>
      ) : (
        <Box className="folder-grid">
          {filesToRender.map((file) => (
            <Box
              key={file._id}
              className="folder-card"
              sx={{
                padding: 2,
                border: '1px solid grey',
                borderRadius: 4,
                backgroundColor: '#1f1e1eff',
              }}
            >
              <InsertDriveFileIcon style={{ color: 'grey'}} fontSize='large'/>
              <Typography fontWeight="bold">{file.name}</Typography>
              <Typography variant="caption" style={{ color: 'white' }}>
                Size: {file.size}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileManager;
