import type { backendInterface } from "./backend";
import { createActorWithConfig } from "./config";

// Simple lazy-initialized backend client for direct (non-actor-hook) usage
let _backend: backendInterface | null = null;
let _initPromise: Promise<backendInterface> | null = null;

async function getBackend(): Promise<backendInterface> {
  if (_backend) return _backend;
  if (!_initPromise) {
    _initPromise = createActorWithConfig().then((b) => {
      _backend = b;
      return b;
    });
  }
  return _initPromise;
}

// Proxy that lazily initializes the backend
export const backend = new Proxy({} as backendInterface, {
  get(_target, prop) {
    return async (...args: unknown[]) => {
      const b = await getBackend();
      return (b as unknown as Record<string, (...a: unknown[]) => unknown>)[
        prop as string
      ](...args);
    };
  },
});
