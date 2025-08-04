import { Request, Response } from 'express';
import { File } from '../models/file.model';
import { file } from 'zod';

export const createFile = async (req: Request, res: Response) => {
  try {
    const { name, content, folderId } = req.body;
    const createdBy = (req as any).user.id;

    const file = await File.create({ name, content, folderId, createdBy,isDeleted: false, });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: 'File creation failed', error: err });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const deleted = req.query.deleted === 'true';
    const files = await File.find({
      isDeleted: deleted,
      $or: [{ createdBy: user.id }, { sharedWith: user.id }],
    });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!file) return res.status(404).json({ message: 'File not found' });
    // await File.findByIdAndDelete(id);
    res.status(200).json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
};

export const shareFile = async (req: Request, res: Response) => {
  const {fileId, userId} = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.sharedWith?.includes(userId)) {
      file.sharedWith?.push(userId);
      await file.save();
    }
    res.status(200).json({ message: 'File shared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Share failed', error: err });
  }
};

// Restore a soft-deleted file
export const restoreFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.status(200).json({ message: 'File restored', file });
  } catch (err) {
    res.status(500).json({ message: 'Restore failed', error: err });
  }
};

// Permanently delete a file
export const deleteFilePermanently = async (req: Request, res: Response) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Optional: remove from filesystem/cloud if you store file data externally

    res.status(200).json({ message: 'File permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Permanent delete failed', error: err });
  }
};
