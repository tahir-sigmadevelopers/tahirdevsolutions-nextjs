import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  ipAddress?: string;
  userAgent?: string;
}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address.`,
    },
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

// Add indexes for better query performance
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;