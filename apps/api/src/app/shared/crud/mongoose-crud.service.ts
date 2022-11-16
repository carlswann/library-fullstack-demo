/* eslint-disable no-sequences */
import { CrudRequest, CreateManyDto, CrudService } from '@nestjsx/crud';
import { Model } from 'mongoose';

export class MongooseCrudService<T> extends CrudService<T> {
  constructor(public model: Model<any>) {
    super();
  }

  buildQuery(req: CrudRequest) {
    const { limit = 10, page = 1, filter = [], fields = [], sort = [], join = [], paramsFilter = [] } = req.parsed;
    let { offset: skip = 0 } = req.parsed;
    if (page > 1) {
      skip = (page - 1) * limit;
    }

    const options = {
      page,
      skip,
      limit,
      // eslint-disable-next-line no-return-assign
      sort: sort.reduce((acc, v) => ((acc[v.field] = v.order === 'ASC' ? 1 : -1), acc), {}),
      populate: join.map((v) => v.field),
      select: fields.join(' '),
    };

    const where = filter.reduce((acc, { field, operator, value }) => {
      let cond = null;
      switch (operator as any) {
        case 'starts':
          cond = new RegExp(`^${value}`, 'i');
          break;
        case 'ends':
          cond = new RegExp(`${value}$`, 'i');
          break;
        case 'cont':
        case '$contL':
          cond = new RegExp(`${value}`, 'i');
          break;
        case 'excl':
          cond = { $ne: new RegExp(`${value}`, 'i') };
          break;
        case 'notin':
          cond = { $nin: value };
          break;
        case 'isnull':
          cond = null;
          break;
        case 'notnull':
          cond = { $ne: null };
          break;
        case 'between': {
          const [min, max] = value;
          cond = { $gte: min, $lte: max };
          break;
        }
        default:
          cond = { [`${operator.startsWith('$') ? '' : '$'}${operator}`]: value };
      }

      acc[field] = cond;
      return acc;
    }, {});

    if (req.parsed.authPersist) {
      Object.assign(where, req.parsed.authPersist);
    }

    const idParam = paramsFilter.find((v) => v.field === 'id');
    return { options, where, id: idParam ? idParam.value : null };
  }

  async getMany(req: CrudRequest) {
    const { options, where } = this.buildQuery(req);
    const queryBuilder = this.model
      .find()
      .setOptions({
        ...options,
      })
      .where({
        ...where,
      });

    options.populate.forEach((v) => {
      queryBuilder.populate(v);
    });

    const data = await queryBuilder.exec();
    if (options.page) {
      const total = await this.model.countDocuments(where);
      return this.createPageInfo(
        data.map((i) => JSON.parse(JSON.stringify(i))),
        total,
        options.limit,
        options.skip
      );
    }
    return data;
  }

  async getOne(req: CrudRequest): Promise<T> {
    const { options, where, id } = this.buildQuery(req);
    const queryBuilder = this.model
      .findById(id)
      .setOptions({
        ...options,
      })
      .where({
        ...where,
      });
    options.populate.forEach((v) => {
      queryBuilder.populate(v);
    });

    const data = await queryBuilder.exec();

    if (!data) {
      this.throwNotFoundException(this.model.modelName);
    }

    return JSON.parse(JSON.stringify(data));
  }

  async createOne(req: CrudRequest, dto: T): Promise<T> {
    return await this.model.create({
      ...dto,
      ...(req.parsed.authPersist ?? {})
    });
  }

  async createMany(req: CrudRequest, dto: CreateManyDto<never>): Promise<T[]> {
    return await this.model.insertMany(dto.bulk);
  }

  async updateOne(req: CrudRequest, dto: T): Promise<T> {
    const { id } = this.buildQuery(req);
    const data = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      this.throwNotFoundException(this.model.modelName);
    }

    return JSON.parse(JSON.stringify(data));
  }

  async replaceOne(req: CrudRequest, dto: T): Promise<T> {
    const { id } = this.buildQuery(req);
    const data = await this.model.replaceOne(
      {
        _id: id,
      },
      dto
    );

    if (!data) {
      this.throwNotFoundException(this.model.modelName);
    }

    return this.model.findById(id);
  }

  async deleteOne(req: CrudRequest): Promise<void | T> {
    const { id } = this.buildQuery(req);
    const data = await this.model.findById(id);
    if (!data) {
      this.throwNotFoundException(this.model.modelName);
    }

    await this.model.findByIdAndDelete(id);

    return JSON.parse(JSON.stringify(data));
  }
}
