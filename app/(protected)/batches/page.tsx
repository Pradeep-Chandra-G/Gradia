import { BatchManagementClient } from "@/app/components/batch/BatchManagementClient";
import { getBatches } from "@/app/actions/batch-actions";

export default async function BatchManagementPage() {
  const result = await getBatches();

  const initialBatches =
    result.success && result.batches
      ? result.batches.map((batch) => ({
          id: batch.id,
          name: batch.name,
          createdAt: batch.createdAt.toISOString(),
          members: batch.members.map((m) => ({
            id: m.id,
            user: {
              name: m.user.name,
              email: m.user.email,
            },
          })),
          tests: batch.tests.map((t) => ({
            id: t.id,
            title: t.title,
          })),
        }))
      : [];

  return <BatchManagementClient initialBatches={initialBatches} />;
}
