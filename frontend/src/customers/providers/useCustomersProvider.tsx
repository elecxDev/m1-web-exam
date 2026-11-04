import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
} from "../models/CustomerModel";

export interface PaginatedCustomersModel {
  totalCount: number;
  customers: CustomerModel[];
}

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (targetPage: number = page, targetLimit: number = pageSize) => {
    setIsLoading(true);
    return axios
      .get<PaginatedCustomersModel>("http://localhost:3000/customers", {
        params: { page: targetPage, limit: targetLimit },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setPage(targetPage);
        setPageSize(targetLimit);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    return axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      const nextPage = customers.length === 1 && page > 1 ? page - 1 : page;
      load(nextPage, pageSize);
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => {
        load(page, pageSize);
      });

  return {
    customers,
    totalCount,
    page,
    pageSize,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
