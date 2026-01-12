import React from 'react';
import { bodys, eyes, clothes, faces, hands, heads, mouths } from './svgs';
import { WearableIndices } from '@/hooks/useSvgLayers';

interface EnhancedGotchiSvgProps extends React.SVGProps<SVGSVGElement> {
  wearableIndices: WearableIndices;
}

const EnhancedGotchiSvg: React.FC<EnhancedGotchiSvgProps> = ({
  wearableIndices,
  ...props
}) => {
  const bodyComponent = bodys(wearableIndices.bodyIndex);
  const eyeComponent = eyes(wearableIndices.eyeIndex);
  const handComponent = hands(wearableIndices.handIndex);
  const headComponent = heads(wearableIndices.headIndex);
  const clothesComponent = clothes(wearableIndices.clothesIndex);
  const faceComponent = faces(wearableIndices.faceIndex);
  const mouthComponent = mouths(wearableIndices.mouthIndex);

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
              display: ${wearableIndices.handIndex !== 0 ? 'block' : 'none'};
          }
          .gotchiHandClose {
              display: ${wearableIndices.handIndex !== 0 ? 'none' : 'block'};
          }
      `}</style>

      {bodyComponent}
      {eyeComponent}
      {handComponent}
      {headComponent}
      {clothesComponent}
      {faceComponent}
      {mouthComponent}
    </svg>
  );
};

export default EnhancedGotchiSvg;