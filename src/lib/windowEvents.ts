export const WINDOW_OPEN_EVENT = "window:open";

export interface WindowOpenEventDetail {
  windowId: string;
}

export const dispatchWindowOpenEvent = (windowId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<WindowOpenEventDetail>(WINDOW_OPEN_EVENT, {
      detail: { windowId },
    }),
  );
};

