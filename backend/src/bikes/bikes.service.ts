import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
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
export class BikesService {
  constructor(
    @Inject(BikesRepository)
    private readonly repository: BikesRepository,
  ) {}

  findAll(page: number = 1, limit: number = 10): Promise<PaginatedBikesModel> {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    return await this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    try {
      return await this.repository.update(id, input);
    } catch (error) {
      this.translateError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (error instanceof BikeNotFoundError)
      throw new NotFoundException("Bike not found");
    if (error instanceof BikeHasSalesConflictError)
      throw new ConflictException(
        "Cannot delete bicycle associated with sales",
      );
    throw error;
  }
}
