import {
  EyeOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Row, Space, Tag } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  const formattedPrice = (bike.priceCents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <ListItem>
      <Col span={8}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShoppingOutlined />
          <strong>{bike.brand}</strong> {bike.model}
          {bike.electric && (
            <Tag color="cyan" icon={<ThunderboltOutlined />}>
              Electric
            </Tag>
          )}
        </Space>
      </Col>
      <Col span={7}>
        <Space orientation="horizontal">
          <Tag color="blue">{bike.category}</Tag>
          <span>{bike.frameMaterial}</span>
          <span style={{ color: "#888" }}>
            {bike.frameSizeCm}cm / {bike.wheelSizeInches}&quot;
          </span>
        </Space>
      </Col>
      <Col span={5}>
        <span style={{ fontWeight: 600 }}>{formattedPrice}</span>
      </Col>
      <Col span={4}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <ButtonLink to={`/bikes/$bikeId`} params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};

