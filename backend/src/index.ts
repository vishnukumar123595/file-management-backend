import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import fileRoutes from './routes/file.routes';
import folderRoutes from './routes/folder.routes';
import userRoutes from './routes/user.routes';
import searchRoutes from './routes/search.routes';
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const app = express();
const PORT = process.env.PORT || 5000;

// DB connect

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/files-db')
  .then(() => console.log('MongoDB connected'))
  
  .catch(err => console.error('DB error:', err));
  console.log('JWT_SECRET:', process.env.JWT_SECRET);


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
