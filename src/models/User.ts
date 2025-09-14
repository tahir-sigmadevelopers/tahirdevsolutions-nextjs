import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: {
    public_id?: string;
    url?: string;
  };
  role: string;
  joinedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  generateResetToken: () => Promise<string>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address.`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.methods.generateResetToken = async function () {
  const resetToken = crypto.randomBytes(16).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 60 * 1000);

  return resetToken;
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
