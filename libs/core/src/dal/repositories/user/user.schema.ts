import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserEntity } from './user.entity';

const userSchema = new Schema(
  {
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    profilePicture: Schema.Types.String,
    tokens: [
      {
        providerId: Schema.Types.String,
        provider: Schema.Types.String,
        accessToken: Schema.Types.String,
        refreshToken: Schema.Types.String,
        valid: Schema.Types.Boolean,
        lastUsed: Schema.Types.Date,
      },
    ],
    password: Schema.Types.String,
  },
  schemaOptions
);

export interface IUserDocument extends UserEntity, Document {
  _id: string;
}

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
