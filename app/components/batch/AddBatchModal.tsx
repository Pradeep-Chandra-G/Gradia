import { addStudentsToBatch } from "@/app/actions/batch-actions";
import { Batch } from "@/generated/prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

// Add Students Modal Component
function AddStudentsModal({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<"manual" | "bulk">("manual");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emails.trim()) {
      alert("Please enter at least one email");
      return;
    }

    const emailList = emails
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailList.length === 0) {
      alert("No valid emails found");
      return;
    }

    setLoading(true);
    try {
      const result = await addStudentsToBatch(batch.id, emailList);

      if (result.success) {
        alert(`Successfully added ${result.addedCount} student(s)`);
        if (result.errors && result.errors.length > 0) {
          alert(`Failed to add: ${result.errors.join(", ")}`);
        }
        router.push(router.asPath);
        onClose();
      } else {
        alert(result.error || "Failed to add students");
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
      <div className="bg-foreground rounded-xl border border-white/10 p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add Students to {batch.name}</h2>
            <p className="text-sm text-gray-400">
              Currently {batch.members.length} students
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Manual Entry */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Student Emails (one per line)
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="alice@example.com&#10;bob@example.com&#10;charlie@example.com"
            rows={8}
            className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none resize-none font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-2">
            {emails.split("\n").filter((e) => e.trim()).length} email(s) entered
          </p>
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
            disabled={!emails.trim() || loading}
            className="flex-1 px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Students"}
          </button>
        </div>
      </div>
    </div>
  );
}
