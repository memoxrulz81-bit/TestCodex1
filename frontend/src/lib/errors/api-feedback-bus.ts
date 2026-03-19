type ApiEvent = "unauthorized" | "forbidden";
type Listener = () => void;

const listeners: Record<ApiEvent, Set<Listener>> = {
  unauthorized: new Set(),
  forbidden: new Set(),
};

export const emitApiEvent = (event: ApiEvent) => {
  listeners[event].forEach((listener) => listener());
};

export const subscribeToApiEvent = (event: ApiEvent, listener: Listener) => {
  listeners[event].add(listener);

  return () => {
    listeners[event].delete(listener);
  };
};
