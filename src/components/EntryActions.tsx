"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntryMenu } from "@/components/EntryMenu";

export function EntryActions({
  entryId,
  onEditClick,
}: {
  entryId: string;
  onEditClick?: () => void;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      setShowDeleteModal(false);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not delete this entry.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <EntryMenu
        onEditClick={onEditClick}
        onDeleteClick={() => {
          setError(null);
          setShowDeleteModal(true);
        }}
      />
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-100 bg-black opacity-50"
            onClick={() => {
              if (!isDeleting) {
                setShowDeleteModal(false);
              }
            }}
            aria-hidden="true"
          />
          <div className="fixed top-1/2 left-1/2 z-120 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-[#222222] p-6 text-center shadow-lg">
            <div className="text-2xl font-bold">Delete Entry?</div>
            <div className="my-5">
              Once you delete this entry, it can&apos;t be restored.
            </div>
            {error ? <div className="text-sm text-red-400">{error}</div> : null}
            <div className="my-5 flex justify-end">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="mr-1 cursor-pointer rounded bg-red-500 p-2 font-bold text-white"
              >
                {isDeleting ? "DELETING..." : "DELETE"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="ml-1 cursor-pointer rounded bg-[#5c5c5c] p-2 font-bold"
              >
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
