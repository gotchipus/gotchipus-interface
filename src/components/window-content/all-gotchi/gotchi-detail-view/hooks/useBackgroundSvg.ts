import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { backgrounds } from '@/components/gotchiSvg/svgs';

export const useBackgroundSvg = (backgroundIndex: number) => {
  const backgroundSvg = useMemo(() => {
    const backgroundComponent = backgrounds(backgroundIndex);
    if (!backgroundComponent) return null;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${renderToStaticMarkup(backgroundComponent)}</svg>`;
  }, [backgroundIndex]);

  const backgroundStyle = useMemo(() => {
    if (!backgroundSvg) return {};

    return {
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvg)}")`,
    };
  }, [backgroundSvg]);

  return { backgroundSvg, backgroundStyle };
};
