import mongoose, { Schema, Document } from 'mongoose';
import { IBlog } from './Blog';
import { IUser } from './User';

export interface IComment extends Document {
  blog: IBlog['_id'];
  user?: IUser['_id'];
  name: string;
  email: string;
  comment: string;
  parentComment?: IComment['_id'];
  likes: IUser['_id'][];
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'blog',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'comment',
    default: null,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.models.comment || mongoose.model<IComment>('comment', commentSchema);

export default Comment;
