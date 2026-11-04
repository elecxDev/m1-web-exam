import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PaginationQueryDto } from "../customers/dto/pagination-query.dto";
import { BikesService } from "./bikes.service";
import { BikeResponseDto } from "./dto/bike-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { PaginatedBikesResponseDto } from "./dto/paginated-bikes-response.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedBikesResponseDto> {
    const { totalCount, bikes } = await this.service.findAll(
      query.page,
      query.limit,
    );
    return {
      totalCount,
      bikes: bikes.map((model) => BikeResponseDto.fromModel(model)),
    };
  }

  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}
