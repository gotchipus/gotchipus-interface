import React from 'react';

const mouths = (index: number) => {
  switch (index){
    case 1: // fish
      return (
        <g className='gotchipus-mouths'>
          <path
            fill="#151516"
            d="M58,70h1v1h-1z M68,70h1v1h-1z M61,72h1v1h-1z M63,73h1v1h-1z M59,75h1v1h-1z M63,76h1v1h-1z M59,77h1v1h-1z M64,77h1v1h-1z M61,79h1v1h-1z M59,71h9v1h-9z M66,72h1v3h-1z M60,73h1v3h-1z M65,75h1v3h-1z M58,76h1v2h-1z M62,77h1v2h-1z M60,78h1v2h-1z"
          />
          <path
            fill="#309EC7"
            d="M65,72h1v1h-1z M61,74h1v1h-1z M63,74h1v1h-1z M62,75h1v1h-1z M59,76h1v1h-1z M61,76h1v1h-1z M61,78h1v1h-1z M62,72h2v1h-2z"
          />
          <path
            fill="#51E8D7"
            d="M64,72h1v1h-1z M64,74h1v1h-1z M61,75h1v1h-1z M62,76h1v1h-1z"
          />
          <path
            fill="#23598E"
            d="M61,73h1v1h-1z M61,77h1v1h-1z M64,75h1v2h-1z M60,76h1v2h-1z"
          />
          <path fill="#90F0DD" d="M64,73h1v1h-1z M62,73h1v2h-1z" />
          <path fill="#5AC2E9" d="M63,75h1v1h-1z M65,73h1v2h-1z" />
        </g>
      );
    case 2: // golden key
      return (
        <g className='gotchipus-mouths'>
          <path
            fill="#151516"
            d="M58,70h1v1h-1z M68,70h1v1h-1z M63,72h1v1h-1z M65,72h1v1h-1z M66,73h1v1h-1z M67,74h1v1h-1z M69,74h1v1h-1z M65,75h1v1h-1z M68,75h1v1h-1z M66,76h1v1h-1z M69,76h1v1h-1z M71,76h1v1h-1z M67,77h1v1h-1z M70,77h1v1h-1z M59,71h9v1h-9z M61,72h1v2h-1z M68,73h2v1h-2z M62,74h3v1h-3z M70,75h2v1h-2z M68,78h2v1h-2z"
          />
          <path
            fill="#ED6F13"
            d="M64,72h1v1h-1z M63,73h1v1h-1z M65,74h1v1h-1z M66,75h1v1h-1z M67,76h1v1h-1z M68,77h1v1h-1z M62,72h1v2h-1z"
          />
          <path
            fill="#F5C730"
            d="M64,73h1v1h-1z M68,74h1v1h-1z M68,76h1v1h-1z M69,77h1v1h-1z"
          />
          <path
            fill="#FAEE89"
            d="M65,73h1v1h-1z M66,74h1v1h-1z M67,75h1v1h-1z M70,76h1v1h-1z"
          />
        </g>
      );
    case 3: // hidden
      return (
        <g className='gotchipus-mouths'></g>
      );
    case 4: // smile
      return (
        <g className='gotchipus-mouths'>
          <path
            fill="#151516"
            d="M58,72h1v2h-1z M68,72h1v2h-1z M59,73h2v2h-2z M66,73h2v2h-2z M61,74h5v2h-5z"
          />
        </g>
      );
    case 5: // starfish
      return (
        <g className='gotchipus-mouths'>
          <path
            fill="#151516"
            d="M58,70h1v1h-1z M68,70h1v1h-1z M67,72h1v1h-1z M68,73h1v1h-1z M57,74h1v1h-1z M68,77h1v1h-1z M59,71h9v1h-9z M57,72h2v1h-2z M56,73h1v2h-1z M59,74h2v1h-2z M69,74h1v3h-1z M58,75h1v2h-1z M65,75h2v1h-2z M61,76h2v1h-2z M66,76h2v1h-2z M59,77h2v1h-2z M63,77h1v2h-1z M66,77h1v2h-1z M64,79h2v1h-2z"
          />
          <path
            fill="#E11B2E"
            d="M59,72h1v1h-1z M57,73h1v1h-1z M61,73h1v1h-1z M67,73h1v1h-1z M62,74h1v1h-1z M68,74h1v1h-1z M59,75h1v1h-1z M60,76h1v1h-1z M62,72h2v2h-2z M65,72h2v1h-2z M64,73h2v1h-2z M64,74h1v2h-1z M63,75h1v2h-1z M65,76h1v2h-1z M64,77h1v2h-1z"
          />
          <path
            fill="#EF6B3B"
            d="M64,72h1v1h-1z M58,73h1v1h-1z M66,73h1v1h-1z M61,74h1v1h-1z M63,74h1v1h-1z M67,74h1v1h-1z M60,75h1v1h-1z M68,75h1v1h-1z M59,76h1v1h-1z M64,76h1v1h-1z M65,78h1v1h-1z M60,72h2v1h-2z"
          />
          <path
            fill="#A50C2C"
            d="M58,74h1v1h-1z M67,75h1v1h-1z M68,76h1v1h-1z M59,73h2v1h-2z M65,74h2v1h-2z M61,75h2v1h-2z"
          />
        </g>
      );
    case 6: // yellow tape
      return (
        <g className='gotchipus-mouths'>
          <path
            fill="#151516"
            d="M54,79h1v1h-1z M56,71h17v1h-17z M53,72h3v1h-3z M72,72h1v7h-1z M53,73h1v7h-1z M55,78h17v1h-17z"
          />
          <path fill="#DF9128" d="M56,72h2v1h-2z M56,73h1v5h-1z M55,76h1v2h-1z" />
          <path
            fill="#ECC63B"
            d="M58,73h1v1h-1z M57,77h1v1h-1z M59,77h1v1h-1z M58,72h14v1h-14z M54,73h2v3h-2z M60,73h1v5h-1z M64,73h1v5h-1z M67,73h2v1h-2z M70,73h2v3h-2z M62,74h1v2h-1z M66,74h1v2h-1z M68,74h1v4h-1z M58,75h1v3h-1z M54,76h1v3h-1z M67,76h1v2h-1z M71,76h1v2h-1z M61,77h3v1h-3z M65,77h2v1h-2z M69,77h2v1h-2z"
          />
          <path
            fill="#F5F1E0"
            d="M58,74h1v1h-1z M62,76h1v1h-1z M66,76h1v1h-1z M70,76h1v1h-1z M57,73h1v4h-1z M59,73h1v4h-1z M61,73h3v1h-3z M65,73h2v1h-2z M69,73h1v4h-1z M61,74h1v3h-1z M63,74h1v3h-1z M65,74h1v3h-1z M67,74h1v2h-1z"
          />
        </g>
      );
  }
};

export default mouths;