import { Assessment } from "@/lib/types";
import { AssessmentRow } from "@/app/components/TableRow";

interface AssessmentTableProps {
  data: Assessment[];
  onActionClick?: (id: string) => void;
}

export function AssessmentTable({ data, onActionClick }: AssessmentTableProps) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-foreground p-2">
      <table className="w-full border-separate border-spacing-y-2 text-sm">
        <thead className="text-muted-foreground">
          <tr className="text-lg text-gray-200">
            <th className="px-4 py-2 text-left font-medium">Assessment Name</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Candidates</th>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((assessment) => (
            <AssessmentRow
              key={assessment.id}
              assessment={assessment}
              onActionClick={onActionClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
