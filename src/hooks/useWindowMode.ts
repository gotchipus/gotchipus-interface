import { useState, useEffect, useRef } from 'react';

export type WindowMode = 'mobile' | 'desktop' | null;

interface WindowModeData {
  mode: WindowMode;
  width: number | null;
}

export function useWindowMode(): WindowModeData {
  const [windowMode, setWindowMode] = useState<WindowModeData>({
    mode: null,
    width: null
  });
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const findWindowContainer = (element: HTMLElement | null): HTMLElement | null => {
      if (!element) return null;
      if (element.hasAttribute('data-window-mode')) return element;
      return findWindowContainer(element.parentElement);
    };

    containerRef.current = findWindowContainer(document.activeElement as HTMLElement)
      || document.querySelector('[data-window-mode]');

    const updateMode = () => {
      const container = containerRef.current || document.querySelector('[data-window-mode]');

      if (container) {
        const mode = container.getAttribute('data-window-mode') as WindowMode;
        const widthStr = container.getAttribute('data-window-width');
        const width = widthStr ? parseInt(widthStr, 10) : null;

        setWindowMode({ mode, width });
      }
    };

    updateMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-window-mode' ||
           mutation.attributeName === 'data-window-width')
        ) {
          updateMode();
        }
      });
    });

    const containers = document.querySelectorAll('[data-window-mode]');
    containers.forEach((container) => {
      observer.observe(container, {
        attributes: true,
        attributeFilter: ['data-window-mode', 'data-window-width']
      });
    });

    const interval = setInterval(updateMode, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return windowMode;
}

export function getGridColumns(width: number | null): number {
  if (!width) return 4;

  if (width <= 640) return 2;
  if (width <= 768) return 3;
  if (width <= 1024) return 4;
  if (width <= 1280) return 5;
  return 6;
}
