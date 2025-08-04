import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  name: string;
  content: string;
  folderId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  sharedWith?: mongoose.Types.ObjectId[];
}

const FileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    content: { type: String, required: false },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

FileSchema.index({ name: 'text', content: 'text' }); // For full-text search

export const File = mongoose.model<IFile>('File', FileSchema);
