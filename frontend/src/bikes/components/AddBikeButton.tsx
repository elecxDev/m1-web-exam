import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

interface BikeFormValues {
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number | null;
  wheelSizeInches: number | null;
  gearCount: number | null;
  weightKg: number | null;
  electric: boolean;
  priceEuros: number | null;
}

type BikeFormErrors = Partial<Record<keyof BikeFormValues, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "road",
  frameMaterial: "aluminium",
  frameSizeCm: 54,
  wheelSizeInches: 28,
  gearCount: 18,
  weightKg: 10,
  electric: false,
  priceEuros: 999,
};

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.description.trim()) errors.description = "Description is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (values.frameSizeCm === null || values.frameSizeCm <= 0)
    errors.frameSizeCm = "Frame size must be greater than 0";
  if (values.wheelSizeInches === null || values.wheelSizeInches <= 0)
    errors.wheelSizeInches = "Wheel size must be greater than 0";
  if (
    values.gearCount === null ||
    values.gearCount < 1 ||
    !Number.isInteger(values.gearCount)
  )
    errors.gearCount = "Gear count must be an integer >= 1";
  if (values.weightKg === null || values.weightKg <= 0)
    errors.weightKg = "Weight must be greater than 0";
  if (values.priceEuros === null || values.priceEuros < 0)
    errors.priceEuros = "Price must be >= 0";
  return errors;
};

export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const close = () => {
    setValues(emptyValues);
    setErrors({});
    setIsOpen(false);
  };

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: CreateBikeModel = {
      brand: values.brand.trim(),
      model: values.model.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      frameMaterial: values.frameMaterial.trim(),
      frameSizeCm: values.frameSizeCm!,
      wheelSizeInches: values.wheelSizeInches!,
      gearCount: values.gearCount!,
      weightKg: values.weightKg!,
      electric: values.electric,
      priceCents: Math.round(values.priceEuros! * 100),
    };

    setIsSaving(true);
    createBike(payload)
      .then(close)
      .finally(() => setIsSaving(false));
  };

  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsOpen(true)}>
        Add bicycle
      </Button>
      <Modal
        okButtonProps={{ loading: isSaving }}
        open={isOpen}
        title="Add a new bicycle model"
        onCancel={close}
        onOk={onConfirm}
        width={600}
      >
        <Typography.Paragraph type="secondary">
          Fill in the specifications for this bicycle model in the catalog.
        </Typography.Paragraph>

        <Row gutter={[12, 12]}>
          <Col span={12}>
            <label htmlFor="bike-brand">Brand</label>
            <Input
              id="bike-brand"
              value={values.brand}
              status={errors.brand && "error"}
              placeholder="e.g. Specialized, Trek"
              onChange={(e) => {
                setValues({ ...values, brand: e.target.value });
                setErrors({ ...errors, brand: undefined });
              }}
            />
            {errors.brand && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {errors.brand}
              </Typography.Text>
            )}
          </Col>

          <Col span={12}>
            <label htmlFor="bike-model">Model</label>
            <Input
              id="bike-model"
              value={values.model}
              status={errors.model && "error"}
              placeholder="e.g. Allez Sport, Trail 7"
              onChange={(e) => {
                setValues({ ...values, model: e.target.value });
                setErrors({ ...errors, model: undefined });
              }}
            />
            {errors.model && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {errors.model}
              </Typography.Text>
            )}
          </Col>

          <Col span={12}>
            <label htmlFor="bike-category">Category</label>
            <Select
              id="bike-category"
              style={{ width: "100%" }}
              value={values.category}
              onChange={(val) => {
                setValues({ ...values, category: val });
                setErrors({ ...errors, category: undefined });
              }}
              options={[
                { label: "Road", value: "road" },
                { label: "Mountain", value: "mountain" },
                { label: "Gravel", value: "gravel" },
                { label: "City", value: "city" },
                { label: "Hybrid", value: "hybrid" },
              ]}
            />
          </Col>

          <Col span={12}>
            <label htmlFor="bike-material">Frame Material</label>
            <Select
              id="bike-material"
              style={{ width: "100%" }}
              value={values.frameMaterial}
              onChange={(val) => {
                setValues({ ...values, frameMaterial: val });
                setErrors({ ...errors, frameMaterial: undefined });
              }}
              options={[
                { label: "Aluminium", value: "aluminium" },
                { label: "Carbon", value: "carbon" },
                { label: "Steel", value: "steel" },
                { label: "Titanium", value: "titanium" },
              ]}
            />
          </Col>

          <Col span={24}>
            <label htmlFor="bike-desc">Description</label>
            <Input.TextArea
              id="bike-desc"
              rows={2}
              value={values.description}
              status={errors.description && "error"}
              placeholder="Brief description of the bicycle model"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
                setErrors({ ...errors, description: undefined });
              }}
            />
            {errors.description && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {errors.description}
              </Typography.Text>
            )}
          </Col>

          <Col span={8}>
            <label htmlFor="bike-frame-size">Frame Size (cm)</label>
            <InputNumber
              id="bike-frame-size"
              style={{ width: "100%" }}
              min={1}
              value={values.frameSizeCm}
              onChange={(v) => {
                setValues({ ...values, frameSizeCm: v });
                setErrors({ ...errors, frameSizeCm: undefined });
              }}
            />
          </Col>

          <Col span={8}>
            <label htmlFor="bike-wheel-size">Wheel Size (in)</label>
            <InputNumber
              id="bike-wheel-size"
              style={{ width: "100%" }}
              min={1}
              value={values.wheelSizeInches}
              onChange={(v) => {
                setValues({ ...values, wheelSizeInches: v });
                setErrors({ ...errors, wheelSizeInches: undefined });
              }}
            />
          </Col>

          <Col span={8}>
            <label htmlFor="bike-gears">Gear Count</label>
            <InputNumber
              id="bike-gears"
              style={{ width: "100%" }}
              min={1}
              step={1}
              value={values.gearCount}
              onChange={(v) => {
                setValues({ ...values, gearCount: v });
                setErrors({ ...errors, gearCount: undefined });
              }}
            />
          </Col>

          <Col span={8}>
            <label htmlFor="bike-weight">Weight (kg)</label>
            <InputNumber
              id="bike-weight"
              style={{ width: "100%" }}
              min={0.1}
              step={0.1}
              value={values.weightKg}
              onChange={(v) => {
                setValues({ ...values, weightKg: v });
                setErrors({ ...errors, weightKg: undefined });
              }}
            />
          </Col>

          <Col span={8}>
            <label htmlFor="bike-price">Price (€)</label>
            <InputNumber
              id="bike-price"
              style={{ width: "100%" }}
              min={0}
              step={10}
              value={values.priceEuros}
              onChange={(v) => {
                setValues({ ...values, priceEuros: v });
                setErrors({ ...errors, priceEuros: undefined });
              }}
            />
          </Col>

          <Col span={8} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <label htmlFor="bike-electric">Electric Assistance</label>
            <div style={{ marginTop: 4 }}>
              <Switch
                id="bike-electric"
                checked={values.electric}
                onChange={(checked) => setValues({ ...values, electric: checked })}
              />{" "}
              <span>{values.electric ? "Yes (E-Bike)" : "No"}</span>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

