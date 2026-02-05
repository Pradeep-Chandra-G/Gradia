"use client";

import {
  Calendar,
  Download,
  Edit2,
  FileText,
  Mail,
  Plus,
  Search,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface Batch {
  id: string;
  name: string;
  createdAt: string;
  members: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  }[];
  tests: {
    id: string;
    title: string;
  }[];
}

interface BatchManagementClientProps {
  initialBatches: Batch[];
}

export function BatchManagementClient({
  initialBatches,
}: BatchManagementClientProps) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter batches based on search
  const filteredBatches = batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Batch Management</h1>
            <p className="text-gray-400">
              Organize students into classes and groups
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Batch
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search batches..."
              className="w-full pl-12 pr-4 py-3 bg-foreground border border-white/10 rounded-lg focus:border-primary-button focus:outline-none"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-button/10 p-2 rounded-lg">
                <Users className="text-primary-button" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Batches</p>
                <p className="text-3xl font-bold">{batches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <UserPlus className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-3xl font-bold">
                  {batches.reduce((sum, b) => sum + b.members.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <FileText className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Tests</p>
                <p className="text-3xl font-bold">
                  {batches.reduce((sum, b) => sum + b.tests.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Calendar className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Avg. Students/Batch</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    batches.reduce((sum, b) => sum + b.members.length, 0) /
                      batches.length || 0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-foreground rounded-xl border border-white/10 p-6 hover:border-primary-button/50 transition-all"
            >
              {/* Batch Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{batch.name}</h3>
                  <p className="text-sm text-gray-400">
                    Created {new Date(batch.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg">
                    <Edit2 size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded-lg">
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Students</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.members.length}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Tests</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.tests.length}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedBatch(batch);
                    setShowAddStudentsModal(true);
                  }}
                  className="px-4 py-2 bg-primary-button/10 border border-primary-button/20 text-primary-button rounded-lg hover:bg-primary-button/20 flex items-center justify-center gap-2 text-sm"
                >
                  <UserPlus size={16} />
                  Add Students
                </button>

                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 flex items-center justify-center gap-2 text-sm">
                  <FileText size={16} />
                  Assign Test
                </button>
              </div>

              {/* Recent Students */}
              {batch.members.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Recent Students:</p>
                  <div className="space-y-2">
                    {batch.members.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary-button/20 flex items-center justify-center text-primary-button text-xs font-bold">
                          {member.user.name.charAt(0)}
                        </div>
                        <span className="text-gray-300">
                          {member.user.name}
                        </span>
                      </div>
                    ))}
                    {batch.members.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{batch.members.length - 3} more students
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBatches.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg mb-2">No batches found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Try a different search term"
                : "Create your first batch to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <CreateBatchModal
          onClose={() => setShowCreateModal(false)}
          onSave={(batchData) => {
            // TODO: Call server action to create batch
            console.log("Creating batch:", batchData);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Add Students Modal */}
      {showAddStudentsModal && selectedBatch && (
        <AddStudentsModal
          batch={selectedBatch}
          onClose={() => {
            setShowAddStudentsModal(false);
            setSelectedBatch(null);
          }}
          onSave={(students) => {
            // TODO: Call server action to add students
            console.log("Adding students:", students);
            setShowAddStudentsModal(false);
          }}
        />
      )}
    </div>
  );
}

// Create Batch Modal Component
function CreateBatchModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
            className="flex-1 px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name, description })}
            disabled={!name.trim()}
            className="flex-1 px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 disabled:opacity-50"
          >
            Create Batch
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Students Modal Component
function AddStudentsModal({
  batch,
  onClose,
  onSave,
}: {
  batch: Batch;
  onClose: () => void;
  onSave: (students: any[]) => void;
}) {
  const [method, setMethod] = useState<"manual" | "bulk">("manual");
  const [emails, setEmails] = useState("");

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

        {/* Method Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMethod("manual")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 ${
              method === "manual"
                ? "border-primary-button bg-primary-button/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <Mail className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Add by Email</p>
            <p className="text-xs text-gray-400 mt-1">Enter emails manually</p>
          </button>

          <button
            onClick={() => setMethod("bulk")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 ${
              method === "bulk"
                ? "border-primary-button bg-primary-button/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <Upload className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Bulk Import</p>
            <p className="text-xs text-gray-400 mt-1">Upload CSV file</p>
          </button>
        </div>

        {/* Manual Entry */}
        {method === "manual" && (
          <div>
            <label className="block text-sm font-semibold mb-2">
              Student Emails (one per line)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={
                "alice@example.com\nbob@example.com\ncharlie@example.com"
              }
              rows={8}
              className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              {emails.split("\n").filter((e) => e.trim()).length} email(s)
              entered
            </p>
          </div>
        )}

        {/* Bulk Upload */}
        {method === "bulk" && (
          <div>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-400 mb-2">
                Drop CSV file here or click to upload
              </p>
              <p className="text-xs text-gray-500 mb-4">
                CSV should have columns: name, email
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="px-6 py-2 bg-primary-button rounded-lg hover:bg-primary-button/90 cursor-pointer inline-block"
              >
                Choose File
              </label>
            </div>

            <div className="mt-4">
              <button className="text-sm text-primary-button hover:underline flex items-center gap-2">
                <Download size={16} />
                Download CSV Template
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const emailList = emails.split("\n").filter((e) => e.trim());
              onSave(emailList);
            }}
            disabled={method === "manual" && !emails.trim()}
            className="flex-1 px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 disabled:opacity-50"
          >
            Add Students
          </button>
        </div>
      </div>
    </div>
  );
}
