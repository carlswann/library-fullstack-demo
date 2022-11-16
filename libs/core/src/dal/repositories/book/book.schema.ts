import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { BookEntity } from './book.entity';

const personSchema = new Schema({
  birth_year: Schema.Types.Number,
  death_year: Schema.Types.Number,
  name: Schema.Types.String,
});

const bookSchema = new Schema({
    gutenbergId: Schema.Types.Number,
    authors: [personSchema],
    bookshelves: [Schema.Types.String],
    copyright: Schema.Types.Boolean,
    download_count: Schema.Types.Number,
    formats: Schema.Types.Mixed,
    languages: [Schema.Types.String],
    media_type: Schema.Types.String,
    subjects: [Schema.Types.String],
    title: Schema.Types.String,
    translators: [personSchema],
  },
  schemaOptions
);

export interface IBookDocument extends BookEntity, Document {
  _id: string;
}

export const Book = mongoose.models.Book || mongoose.model<IBookDocument>('Book', bookSchema);
