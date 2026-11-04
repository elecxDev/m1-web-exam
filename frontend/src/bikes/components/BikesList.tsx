import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const {
    bikes,
    totalCount,
    page,
    pageSize,
    deleteBike,
    createBike,
    isLoading,
    load,
  } = useBikesProvider();

  useEffect(() => {
    load();
  }, []);

  return (
    <Space
      orientation="vertical"
      style={{ padding: ".25rem .5rem", width: "100%" }}
    >
      <AddBikeButton createBike={createBike} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {bikes.map((bike) => (
            <BikeListItem key={bike.id} bike={bike} deleteBike={deleteBike} />
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

