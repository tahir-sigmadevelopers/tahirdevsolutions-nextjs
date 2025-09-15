import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './Category';
import { IComment } from './Comment';

export interface IBlog extends Document {
  title: string;
  slug: string;
  author: string;
  shortDescription: string;
  category: ICategory['_id'];
  content: string;
  createdAt: Date;
  image: {
    public_id?: string;
    url: string;
  };
  comments: IComment['_id'][];
  tags: string[];
  shareCount: number;
}

const blogSchema = new Schema<IBlog>({
  title: String,
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    default: 'Muhammad Tahir',
  },
  shortDescription: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  tags: [String],
  shareCount: {
    type: Number,
    default: 0,
  },
});

const Blog = mongoose.models.blog || mongoose.model<IBlog>('blog', blogSchema);

export default Blog;
