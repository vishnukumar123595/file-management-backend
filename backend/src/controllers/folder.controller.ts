import { Request, Response } from 'express';
import { Folder } from '../models/folder.model';

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const createdBy = (req as any).user.id;

    const folder = await Folder.create({ name, parentId: parentId || null, createdBy });
    res.status(201).json({ message: 'Folder created', folder });
  } catch (err) {
    res.status(500).json({ message: 'Folder creation failed', error: err });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({isDeleted: false});
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch folders', error: err });
  }
};


export const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    res.status(200).json({ message: 'Folder moved to trash' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete folder' });
  }
};


export const searchFolders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { q } = req.query;

  try {
    const folders = await Folder.find({
      name: { $regex: q, $options: 'i' },
      createdBy: userId,
      isDeleted: false,
    });

    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err });
  }
};
