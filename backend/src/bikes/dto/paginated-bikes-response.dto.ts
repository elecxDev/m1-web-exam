import { BikeResponseDto } from "./bike-response.dto";

export class PaginatedBikesResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];
}

