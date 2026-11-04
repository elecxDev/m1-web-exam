import { DeleteOutlined } from "@ant-design/icons";
import { Alert, Button, Modal } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const DeleteBikeButton = ({ bike, deleteBike }: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onCancel = () => {
    setIsOpen(false);
    setErrorMessage(null);
  };

  const onConfirm = () => {
    setIsDeleting(true);
    setErrorMessage(null);
    deleteBike(bike.id)
      .then(() => {
        setIsOpen(false);
      })
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          setErrorMessage(
            "Cannot delete this bicycle because it has associated sales records. Sales history must be preserved.",
          );
        } else {
          setErrorMessage("An unexpected error occurred while deleting the bicycle.");
        }
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true, loading: isDeleting }}
        cancelButtonProps={{ disabled: isDeleting }}
        open={isOpen}
        title={`Delete ${bike.brand} ${bike.model}`}
        onCancel={onCancel}
        onOk={onConfirm}
        okText="Yes, delete"
      >
        {errorMessage ? (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            style={{ marginBottom: 12 }}
          />
        ) : null}
        <p>
          You are about to delete the bicycle <strong>{bike.brand} {bike.model}</strong>.
          This action cannot be undone. Are you sure?
        </p>
      </Modal>
    </>
  );
};

