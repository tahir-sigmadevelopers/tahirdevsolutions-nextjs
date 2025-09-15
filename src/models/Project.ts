import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  link: string;
  category: string;
  createdAt: Date;
  image: {
    public_id?: string;
    url: string;
  };
  featured: boolean;
  technologies?: string[];
  status?: string;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
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
  featured: {
    type: Boolean,
    default: false,
  },
  technologies: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: 'Completed',
  },
});

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
