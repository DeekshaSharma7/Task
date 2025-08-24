"use client";
import { useState } from "react";
import Button from "./Button";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { task: string; dueDate: string }) => void;
  initialData?: { task: string; dueDate: string };
  mode?: "add" | "edit";
}

export default function TodoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}: TodoModalProps) {
  const [formData, setFormData] = useState({
    task: initialData?.task || "",
    dueDate: initialData?.dueDate || "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // Close modal when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgb(44 41 41 / 72%)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" ? "Add New Task" : "Edit Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={formData.task}
              onChange={(e) =>
                setFormData({ ...formData, task: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              placeholder="Enter task description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === "add" ? "Add Task" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
