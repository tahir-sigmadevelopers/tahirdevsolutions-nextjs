import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITestimonial extends Document {
  name?: string;
  description: string;
  company?: string;
  role?: string;
  imageUrl?: string;
  user?: IUser['_id'];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt
});

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;