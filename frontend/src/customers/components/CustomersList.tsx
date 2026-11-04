import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    page,
    pageSize,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();

  useEffect(() => {
    load();
  }, []);

  return (
    <Space
      orientation="vertical"
      style={{ padding: ".25rem .5rem", width: "100%" }}
    >
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {customers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              deleteCustomer={deleteCustomer}
            />
          ))}
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalCount}
            onChange={(newPage, newPageSize) => load(newPage, newPageSize)}
            showSizeChanger
            pageSizeOptions={[10, 20, 50]}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </>
      )}
    </Space>
  );
};
