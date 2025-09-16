import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  category: string;
  description?: string;
}

const categorySchema = new Schema<ICategory>({
  category: { type: String, required: true },
  description: { type: String, default: '' }
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;