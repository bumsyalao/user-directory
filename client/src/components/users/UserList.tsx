import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { User } from "../../types/user.types";
import { UserCard } from "./UserCard";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";

const ROW_HEIGHT = 104;
const ROW_GAP = 12;

interface UserListProps {
  users: User[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  onLoadMore: () => void;
  onRetry: () => void;
}

/** Virtualized, infinitely scrolling list of user cards. */
export function UserList({
  users,
  isInitialLoading,
  isLoadingMore,
  error,
  hasMore,
  total,
  onLoadMore,
  onRetry,
}: UserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + ROW_GAP,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (isInitialLoading || isLoadingMore || !hasMore || users.length === 0) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) {
      return;
    }

    if (lastItem.index >= users.length - 5) {
      onLoadMore();
    }
  }, [
    hasMore,
    isInitialLoading,
    isLoadingMore,
    onLoadMore,
    users.length,
    virtualItems,
  ]);

  if (isInitialLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Spinner label="Loading users..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Showing {users.length.toLocaleString()} of {total.toLocaleString()} users
      </p>

      <div
        ref={parentRef}
        className="h-[min(70vh,720px)] overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-3"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const user = users[virtualRow.index];
            return (
              <div
                key={user.id}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: `${ROW_GAP}px`,
                }}
              >
                <UserCard user={user} />
              </div>
            );
          })}
        </div>
      </div>

      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <Spinner label="Loading more..." size="sm" />
        </div>
      )}
    </div>
  );
}
