import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  CreateBikeModel,
  PaginatedBikesModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeHasSalesConflictError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedBikesModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { brand: "ASC", model: "ASC", id: "ASC" },
      });
    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = repository.create(input);
    return this.toBikeModel(await repository.save(entity));
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      const entity = await repository.findOneBy({ id });
      if (!entity) throw new BikeNotFoundError();
      repository.merge(entity, input);
      return this.toBikeModel(await repository.save(entity));
    });
  }

  async delete(id: string): Promise<void> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = await repository.findOneBy({ id });
    if (!entity) throw new BikeNotFoundError();

    const hasSales = await this.dataSource
      .getRepository(BikeSellEntity)
      .existsBy({ bikeId: id });
    if (hasSales) throw new BikeHasSalesConflictError();

    await repository.delete(id);
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
