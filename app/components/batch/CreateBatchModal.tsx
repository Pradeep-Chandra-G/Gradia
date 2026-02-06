"use client";

import { useState } from "react";
import {
  createBatch,
  addStudentsToBatch,
  deleteBatch,
} from "@/app/actions/batch-actions";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// Create Batch Modal Component
function CreateBatchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a batch name");
      return;
    }

    setLoading(true);
    try {
      const result = await createBatch({ name, description });

      if (result.success) {
        alert("Batch created successfully!");
        router.refresh();
        onClose();
      } else {
        alert(result.error || "Failed to create batch");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-foreground rounded-xl border border-white/10 p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create New Batch</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Batch Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Computer Science 2024"
              className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className="flex-1 px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>
        </div>
      </div>
    </div>
  );
}
