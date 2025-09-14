import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITestimonial extends Document {
  description: string;
  user?: IUser['_id'];
  approved: boolean;
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
});

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;
