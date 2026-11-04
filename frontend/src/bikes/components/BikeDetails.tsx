import {
  ArrowLeftOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike } = useBikeDetailsProvider(bikeId);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<Partial<BikeModel> & { priceEuros?: number }>({});

  useEffect(() => {
    load();
  }, [bikeId]);

  const startEditing = () => {
    if (!bike) return;
    setValues({
      brand: bike.brand,
      model: bike.model,
      description: bike.description,
      category: bike.category,
      frameMaterial: bike.frameMaterial,
      frameSizeCm: bike.frameSizeCm,
      wheelSizeInches: bike.wheelSizeInches,
      gearCount: bike.gearCount,
      weightKg: bike.weightKg,
      electric: bike.electric,
      priceEuros: bike.priceCents / 100,
    });
    setIsEditing(true);
  };

  const cancel = () => {
    setIsEditing(false);
  };

  const save = () => {
    if (!bike) return;
    const input: UpdateBikeModel = {
      brand: values.brand?.trim() || undefined,
      model: values.model?.trim() || undefined,
      description: values.description?.trim() || undefined,
      category: values.category?.trim() || undefined,
      frameMaterial: values.frameMaterial?.trim() || undefined,
      frameSizeCm: values.frameSizeCm ?? undefined,
      wheelSizeInches: values.wheelSizeInches ?? undefined,
      gearCount: values.gearCount ?? undefined,
      weightKg: values.weightKg ?? undefined,
      electric: values.electric !== undefined ? values.electric : undefined,
      priceCents:
        values.priceEuros !== undefined
          ? Math.round(values.priceEuros * 100)
          : undefined,
    };

    setIsSaving(true);
    updateBike(input)
      .then(() => setIsEditing(false))
      .finally(() => setIsSaving(false));
  };

  const generalItems: DescriptionsProps["items"] = bike
    ? [
        {
          key: "brand",
          label: "Brand",
          children: isEditing ? (
            <Input
              value={values.brand}
              onChange={(e) => setValues({ ...values, brand: e.target.value })}
            />
          ) : (
            bike.brand
          ),
        },
        {
          key: "model",
          label: "Model",
          children: isEditing ? (
            <Input
              value={values.model}
              onChange={(e) => setValues({ ...values, model: e.target.value })}
            />
          ) : (
            bike.model
          ),
        },
        {
          key: "category",
          label: "Category",
          children: isEditing ? (
            <Select
              style={{ width: "100%" }}
              value={values.category}
              onChange={(val) => setValues({ ...values, category: val })}
              options={[
                { label: "Road", value: "road" },
                { label: "Mountain", value: "mountain" },
                { label: "Gravel", value: "gravel" },
                { label: "City", value: "city" },
                { label: "Hybrid", value: "hybrid" },
              ]}
            />
          ) : (
            <Tag color="blue">{bike.category}</Tag>
          ),
        },
        {
          key: "price",
          label: "Price",
          children: isEditing ? (
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={10}
              value={values.priceEuros}
              onChange={(v) => setValues({ ...values, priceEuros: v ?? 0 })}
            />
          ) : (
            <strong>
              {(bike.priceCents / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </strong>
          ),
        },
        {
          key: "description",
          label: "Description",
          span: 2,
          children: isEditing ? (
            <Input.TextArea
              rows={3}
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          ) : (
            bike.description
          ),
        },
      ]
    : [];

  const specsItems: DescriptionsProps["items"] = bike
    ? [
        {
          key: "material",
          label: "Frame Material",
          children: isEditing ? (
            <Select
              style={{ width: "100%" }}
              value={values.frameMaterial}
              onChange={(val) => setValues({ ...values, frameMaterial: val })}
              options={[
                { label: "Aluminium", value: "aluminium" },
                { label: "Carbon", value: "carbon" },
                { label: "Steel", value: "steel" },
                { label: "Titanium", value: "titanium" },
              ]}
            />
          ) : (
            bike.frameMaterial
          ),
        },
        {
          key: "frameSize",
          label: "Frame Size",
          children: isEditing ? (
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              value={values.frameSizeCm}
              onChange={(v) => setValues({ ...values, frameSizeCm: v ?? 0 })}
            />
          ) : (
            `${bike.frameSizeCm} cm`
          ),
        },
        {
          key: "wheelSize",
          label: "Wheel Size",
          children: isEditing ? (
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              value={values.wheelSizeInches}
              onChange={(v) =>
                setValues({ ...values, wheelSizeInches: v ?? 0 })
              }
            />
          ) : (
            `${bike.wheelSizeInches} inches`
          ),
        },
        {
          key: "gears",
          label: "Gear Count",
          children: isEditing ? (
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              step={1}
              value={values.gearCount}
              onChange={(v) => setValues({ ...values, gearCount: v ?? 0 })}
            />
          ) : (
            bike.gearCount
          ),
        },
        {
          key: "weight",
          label: "Weight",
          children: isEditing ? (
            <InputNumber
              style={{ width: "100%" }}
              min={0.1}
              step={0.1}
              value={values.weightKg}
              onChange={(v) => setValues({ ...values, weightKg: v ?? 0 })}
            />
          ) : (
            `${bike.weightKg} kg`
          ),
        },
        {
          key: "electric",
          label: "Electric Assistance",
          children: isEditing ? (
            <Switch
              checked={values.electric}
              onChange={(c) => setValues({ ...values, electric: c })}
            />
          ) : bike.electric ? (
            <Tag color="cyan" icon={<ThunderboltOutlined />}>
              E-Bike (Assistance)
            </Tag>
          ) : (
            "No (Muscular)"
          ),
        },
      ]
    : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem", boxSizing: "border-box", width: "100%", overflowX: "hidden",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bicycles
      </ButtonLink>

      <Space align="center" style={{ width: "100%", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Space align="center">
          <ShoppingOutlined style={{ fontSize: "1.5rem" }} />
          {isLoading ? (
            <Skeleton.Input active size="large" />
          ) : (
            <Typography.Title level={2} style={{ margin: 0 }}>
              {bike ? `${bike.brand} ${bike.model}` : "Bicycle not found"}
            </Typography.Title>
          )}
        </Space>

        {bike && (
          <Space>
            {isEditing ? (
              <>
                <Button icon={<CloseOutlined />} onClick={cancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={isSaving}
                  onClick={save}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button icon={<EditOutlined />} onClick={startEditing}>
                Edit Bicycle
              </Button>
            )}
          </Space>
        )}
      </Space>

      {isLoading ? (
        <Skeleton active />
      ) : bike ? (
        <Row gutter={[16, 16]} style={{ alignSelf: "stretch", width: "100%", margin: 0 }}>
          <Col xs={24} lg={12}>
            <Card title="General Information" style={{ height: "100%" }}>
              <Descriptions
                column={1}
                bordered
                size="small"
                items={generalItems}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Technical Specifications" style={{ height: "100%" }}>
              <Descriptions
                column={1}
                bordered
                size="small"
                items={specsItems}
              />
            </Card>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};




