import { CustomerResponseDto } from "./customer-response.dto";

export class PaginatedCustomersResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];
}

