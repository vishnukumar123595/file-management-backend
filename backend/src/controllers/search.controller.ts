import { Request, Response } from 'express';
import { File } from '../models/file.model';
import { Folder } from '../models/folder.model';

export const search = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Query param "q" is required' });
  }

  try {
    const files = await File.find(
      { $text: { $search: q }, isDeleted: false },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    const folders = await Folder.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({ files, folders });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
};
