import React from 'react';
import { bodys, backgrounds, eyes } from './svgs';
import { WearableIndices } from '@/hooks/useSvgLayers';

interface GotchiSvgProps extends React.SVGProps<SVGSVGElement> {
  bgIndex?: number;
  bodyIndex?: number;
  eyeIndex?: number;
  wearableIndices?: WearableIndices;
}

const GotchiSvg: React.FC<GotchiSvgProps> = ({
  bgIndex,
  bodyIndex,
  eyeIndex,
  wearableIndices,
  ...props
}) => {
  const actualBgIndex = (bgIndex !== undefined ? bgIndex : (wearableIndices?.backgroundIndex ?? 0)) + 1;
  const actualBodyIndex = (bodyIndex !== undefined ? bodyIndex : (wearableIndices?.bodyIndex ?? 0)) + 1;
  const actualEyeIndex = (eyeIndex !== undefined ? eyeIndex : (wearableIndices?.eyeIndex ?? 0)) + 1;

  const backgroundComponent = backgrounds(actualBgIndex);
  const bodyComponent = bodys(actualBodyIndex);
  const eyeComponent = eyes(actualEyeIndex);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 128 128"
      fill="none"
      {...props}
    >
      <style>{`
          .gotchiHandOpen {
              display: none;
          }
          .gotchiHandClose {
              display: block;
          }
      `}</style>

      {backgroundComponent}
      {bodyComponent}
      {eyeComponent}
    </svg>
  );
};

export default GotchiSvg;