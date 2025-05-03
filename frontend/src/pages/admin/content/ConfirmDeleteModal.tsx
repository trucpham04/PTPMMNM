import React from "react";
import "./ConfirmDeleteModal.scss"; // Import tệp CSS cho modal

interface ConfirmDeleteModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onClose,
  onDelete,
  itemName,
}) => {
  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <span className="custom-modal-title">Confirm Deletion</span>
          {/* <button className="close-button" onClick={onClose}>
            ×
          </button> */}
        </div>
        <div className="custom-modal-body">
          Are you sure you want to delete <strong>{itemName}</strong>?
        </div>
        <div className="custom-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
