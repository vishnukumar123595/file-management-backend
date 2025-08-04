import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  parentId?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  sharedWith?: mongoose.Types.ObjectId[];
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

FolderSchema.index({ name: 'text' }); // For text search

export const Folder = mongoose.model<IFolder>('Folder', FolderSchema);
