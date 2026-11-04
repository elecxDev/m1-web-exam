import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  CreateBikeModel,
  PaginatedBikesModel,
} from "../models/BikeModel";

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (targetPage: number = page, targetLimit: number = pageSize) => {
    setIsLoading(true);
    return axios
      .get<PaginatedBikesModel>("http://localhost:3000/bikes", {
        params: { page: targetPage, limit: targetLimit },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
        setPage(targetPage);
        setPageSize(targetLimit);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteBike = (id: string) => {
    return axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      const nextPage = bikes.length === 1 && page > 1 ? page - 1 : page;
      return load(nextPage, pageSize);
    });
  };

  const createBike = (input: CreateBikeModel) => {
    return axios
      .post<BikeModel>("http://localhost:3000/bikes", input)
      .then(() => {
        return load(page, pageSize);
      });
  };

  return {
    bikes,
    totalCount,
    page,
    pageSize,
    load,
    isLoading,
    deleteBike,
    createBike,
  };
};

