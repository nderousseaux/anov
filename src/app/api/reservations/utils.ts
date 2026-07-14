// Utility functions for reservations API
// These are NOT Next.js Route exports - they are helper functions for testing

export async function getAssignTable(): Promise<
  typeof import("@/lib/tables").assignTable
> {
  if (typeof (global as any).__assignTableOverride === "function") {
    return (global as any).__assignTableOverride;
  }
  const { assignTable } = await import("@/lib/tables");
  return assignTable;
}

export function setAssignTable(
  override: typeof import("@/lib/tables").assignTable | null,
) {
  (global as any).__assignTableOverride = override;
}
