import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  category: string;
}

const categorySchema = new Schema<ICategory>({
  category: String,
});

const Category = mongoose.models.category || mongoose.model<ICategory>('category', categorySchema);

export default Category;
