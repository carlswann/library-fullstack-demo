/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';
import { Document, Model, ProjectionType } from 'mongoose';

export class BaseRepository<T> {
  public _model: Model<any & Document>;

  constructor(protected MongooseModel: Model<any & Document>, protected entity: ClassConstructor<T>) {
    this._model = MongooseModel;
  }

  async count(query: any): Promise<number> {
    return await this.MongooseModel.countDocuments(query);
  }

  async aggregate(query: any[]): Promise<any> {
    return await this.MongooseModel.aggregate(query);
  }

  async findById(id: string, select?: ProjectionType<T>): Promise<T | null> {
    const data = await this.MongooseModel.findById(id, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async findOne(query: any, select?: ProjectionType<T>) {
    const data = await this.MongooseModel.findOne(query, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async delete(query: any) {
    const data = await this.MongooseModel.remove(query);
    return data;
  }

  async find(query: any, select = '', options: { limit?: number; sort?: any; skip?: number } = {}): Promise<T[]> {
    const data = await this.MongooseModel.find(query, select, {
      sort: options.sort || null,
    })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return this.mapEntities(data);
  }

  async create(data: Partial<T>): Promise<T> {
    const newEntity = new this.MongooseModel(data);
    const saved = await newEntity.save();

    return this.mapEntity(saved);
  }

  async createMany(data: T[]) {
    await new Promise<void>((resolve) => {
      this.MongooseModel.collection.insertMany(data, (err) => {
        resolve();
      });
    });
  }

  async update(
    query: any,
    updateBody: any
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.MongooseModel.update(query, updateBody, {
      multi: true,
    });

    saved
    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  protected mapEntity(data: any): T {
    return plainToClass<T, T>(this.entity, JSON.parse(JSON.stringify(data))) as any;
  }

  protected mapEntities(data: any): T[] {
    return plainToClass<T, T[]>(this.entity, JSON.parse(JSON.stringify(data)));
  }
}
