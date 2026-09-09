"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// Returns true only after hydration has completed on the client.
// Avoids hydration mismatches by rendering the server HTML on first paint,
// then updating once mounted. Never called on the server.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}