import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITestimonial extends Document {
  description: string;
  user?: IUser['_id'];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  description: {
    type: String,
    required: true,
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
