import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ShortlistedBookEntity } from './shortlisted-book.entity';

const shortlistedBookSchema = new Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, schemaOptions);

export interface IShortlistedBookDocument extends ShortlistedBookEntity, Document {
  _id: string;
}

export const ShortlistedBook = mongoose.models.ShortlistedBook || mongoose.model<IShortlistedBookDocument>('ShortlistedBook', shortlistedBookSchema);
