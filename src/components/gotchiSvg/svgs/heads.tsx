import React from 'react';

const heads = (index: number) => {
  switch (index){
    case 1: // aviator
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M56,10h1v1h-1z M70,10h1v1h-1z M50,11h1v1h-1z M76,11h1v1h-1z M49,12h1v1h-1z M51,12h1v1h-1z M75,12h1v1h-1z M77,12h1v1h-1z M42,13h1v1h-1z M84,13h1v1h-1z M31,27h1v1h-1z M95,27h1v1h-1z M32,28h1v1h-1z M94,28h1v1h-1z M55,31h1v1h-1z M71,31h1v1h-1z M56,32h1v1h-1z M70,32h1v1h-1z M45,33h1v1h-1z M47,33h1v1h-1z M79,33h1v1h-1z M81,33h1v1h-1z M29,34h1v1h-1z M33,34h1v1h-1z M46,34h1v1h-1z M80,34h1v1h-1z M93,34h1v1h-1z M97,34h1v1h-1z M28,35h1v1h-1z M34,35h1v1h-1z M92,35h1v1h-1z M98,35h1v1h-1z M27,36h1v1h-1z M35,36h1v1h-1z M91,36h1v1h-1z M99,36h1v1h-1z M43,41h1v1h-1z M83,41h1v1h-1z M42,42h1v1h-1z M84,42h1v1h-1z M41,43h1v1h-1z M85,43h1v1h-1z M38,45h1v1h-1z M88,45h1v1h-1z M37,46h1v1h-1z M89,46h1v1h-1z M36,47h1v1h-1z M90,47h1v1h-1z M37,73h1v1h-1z M89,73h1v1h-1z M38,74h1v1h-1z M88,74h1v1h-1z M39,75h1v1h-1z M87,75h1v1h-1z M40,76h1v1h-1z M86,76h1v1h-1z M35,83h1v1h-1z M39,83h1v1h-1z M87,83h1v1h-1z M91,83h1v1h-1z M60,7h7v1h-7z M55,8h5v1h-5z M67,8h5v1h-5z M51,9h4v1h-4z M62,9h3v1h-3z M72,9h4v1h-4z M48,10h3v1h-3z M59,10h3v1h-3z M65,10h3v1h-3z M76,10h3v1h-3z M45,11h3v1h-3z M52,11h4v1h-4z M57,11h2v1h-2z M68,11h2v1h-2z M71,11h4v1h-4z M79,11h3v1h-3z M43,12h2v1h-2z M82,12h2v1h-2z M46,13h3v1h-3z M78,13h3v1h-3z M41,14h1v2h-1z M44,14h2v1h-2z M81,14h2v1h-2z M85,14h1v2h-1z M39,15h2v2h-2z M42,15h2v1h-2z M83,15h2v1h-2z M86,15h2v2h-2z M38,16h1v2h-1z M88,16h1v2h-1z M37,17h1v2h-1z M89,17h1v2h-1z M36,18h1v2h-1z M90,18h1v2h-1z M35,19h1v2h-1z M91,19h1v2h-1z M34,21h1v2h-1z M92,21h1v2h-1z M33,23h1v2h-1z M93,23h1v2h-1z M32,25h1v2h-1z M94,25h1v2h-1z M31,29h1v2h-1z M95,29h1v2h-1z M32,31h1v3h-1z M57,31h3v1h-3z M62,31h3v1h-3z M67,31h3v1h-3z M94,31h1v3h-1z M47,32h4v1h-4z M53,32h2v1h-2z M60,32h2v1h-2z M65,32h2v1h-2z M72,32h2v1h-2z M76,32h4v1h-4z M30,33h2v1h-2z M51,33h2v1h-2z M74,33h2v1h-2z M95,33h2v1h-2z M42,34h3v1h-3z M82,34h3v1h-3z M36,35h2v1h-2z M40,35h2v1h-2z M85,35h2v1h-2z M89,35h2v1h-2z M38,36h2v1h-2z M56,36h15v1h-15z M87,36h2v1h-2z M26,37h1v3h-1z M52,37h4v1h-4z M71,37h4v1h-4z M100,37h1v3h-1z M49,38h3v1h-3z M75,38h3v1h-3z M46,39h3v1h-3z M78,39h3v1h-3z M25,40h1v12h-1z M44,40h2v1h-2z M81,40h2v1h-2z M101,40h1v12h-1z M39,44h2v1h-2z M86,44h2v1h-2z M35,48h1v2h-1z M91,48h1v2h-1z M34,50h1v15h-1z M92,50h1v15h-1z M26,52h1v12h-1z M100,52h1v12h-1z M27,64h1v5h-1z M99,64h1v5h-1z M35,65h1v5h-1z M91,65h1v5h-1z M28,69h1v3h-1z M98,69h1v3h-1z M36,70h1v3h-1z M90,70h1v3h-1z M29,72h1v2h-1z M97,72h1v2h-1z M30,74h1v3h-1z M96,74h1v3h-1z M31,77h1v3h-1z M41,77h1v4h-1z M85,77h1v4h-1z M95,77h1v3h-1z M32,80h1v2h-1z M94,80h1v2h-1z M40,81h1v2h-1z M86,81h1v2h-1z M33,82h2v1h-2z M92,82h2v1h-2z M36,84h3v1h-3z M88,84h3v1h-3z"
          />
          <path
            fill="#8F5E3E"
            d="M51,11h1v1h-1z M75,11h1v1h-1z M33,35h1v1h-1z M93,35h1v1h-1z M30,37h1v1h-1z M96,37h1v1h-1z M30,51h1v1h-1z M96,51h1v1h-1z M29,53h1v1h-1z M97,53h1v1h-1z M31,64h1v1h-1z M95,64h1v1h-1z M60,8h7v1h-7z M55,9h7v1h-7z M65,9h7v1h-7z M51,10h5v1h-5z M57,10h2v1h-2z M68,10h2v1h-2z M71,10h5v1h-5z M48,11h2v1h-2z M77,11h2v1h-2z M45,12h4v1h-4z M78,12h4v1h-4z M43,13h3v1h-3z M81,13h3v1h-3z M42,14h2v1h-2z M83,14h2v1h-2z M30,34h3v3h-3z M94,34h3v3h-3z M29,35h1v4h-1z M97,35h1v4h-1z M28,36h1v17h-1z M98,36h1v17h-1z M27,37h1v27h-1z M99,37h1v27h-1z M30,39h3v1h-3z M94,39h3v1h-3z M26,40h1v12h-1z M29,40h2v1h-2z M96,40h2v1h-2z M100,40h1v12h-1z M29,41h1v3h-1z M97,41h1v3h-1z M30,47h1v2h-1z M96,47h1v2h-1z M28,57h1v12h-1z M98,57h1v12h-1z M29,65h1v2h-1z M97,65h1v2h-1z M29,68h1v4h-1z M97,68h1v4h-1z M32,69h1v2h-1z M94,69h1v2h-1z M30,70h1v4h-1z M96,70h1v4h-1z M32,72h1v2h-1z M94,72h1v2h-1z M31,74h1v3h-1z M95,74h1v3h-1z M32,76h1v4h-1z M94,76h1v4h-1z M33,77h1v5h-1z M93,77h1v5h-1z M34,78h1v4h-1z M92,78h1v4h-1z M35,80h1v3h-1z M91,80h1v3h-1z M36,81h1v3h-1z M90,81h1v3h-1z M37,82h1v2h-1z M89,82h1v2h-1z"
          />
          <path
            fill="#F9EDE1"
            d="M61,18h1v1h-1z M65,18h1v1h-1z M59,19h1v1h-1z M67,19h1v1h-1z M50,20h1v1h-1z M76,20h1v1h-1z M36,25h1v1h-1z M90,25h1v1h-1z M62,10h3v6h-3z M59,11h3v3h-3z M65,11h3v3h-3z M50,12h1v7h-1z M52,12h7v4h-7z M68,12h7v4h-7z M76,12h1v7h-1z M49,13h1v7h-1z M51,13h1v4h-1z M75,13h1v4h-1z M77,13h1v7h-1z M46,14h3v4h-3z M59,14h2v2h-2z M66,14h2v2h-2z M78,14h3v4h-3z M44,15h2v4h-2z M81,15h2v4h-2z M41,16h3v4h-3z M52,16h4v2h-4z M57,16h2v1h-2z M60,16h3v1h-3z M64,16h3v1h-3z M68,16h2v1h-2z M71,16h4v2h-4z M83,16h3v4h-3z M39,17h2v3h-2z M57,17h1v4h-1z M61,17h2v1h-2z M64,17h2v1h-2z M69,17h1v4h-1z M86,17h2v3h-2z M38,18h1v6h-1z M46,18h2v3h-2z M52,18h1v2h-1z M54,18h2v1h-2z M71,18h2v1h-2z M74,18h1v2h-1z M79,18h2v3h-2z M88,18h1v6h-1z M37,19h1v4h-1z M45,19h1v3h-1z M51,19h1v3h-1z M54,19h1v2h-1z M72,19h1v2h-1z M75,19h1v3h-1z M81,19h1v3h-1z M89,19h1v4h-1z M36,20h1v4h-1z M39,20h1v7h-1z M41,20h1v2h-1z M43,20h1v3h-1z M83,20h1v3h-1z M85,20h1v2h-1z M87,20h1v7h-1z M90,20h1v4h-1z M40,21h1v3h-1z M42,21h1v2h-1z M47,21h1v2h-1z M79,21h1v2h-1z M84,21h1v2h-1z M86,21h1v3h-1z M35,22h1v4h-1z M91,22h1v4h-1z M33,25h2v2h-2z M92,25h2v2h-2z M32,27h2v1h-2z M93,27h2v1h-2z"
          />
          <path
            fill="#E4CEB9"
            d="M56,11h1v1h-1z M70,11h1v1h-1z M50,19h1v1h-1z M76,19h1v1h-1z M40,20h1v1h-1z M42,20h1v1h-1z M84,20h1v1h-1z M86,20h1v1h-1z M35,21h1v1h-1z M91,21h1v1h-1z M36,24h1v1h-1z M90,24h1v1h-1z M34,27h1v1h-1z M92,27h1v1h-1z M33,28h1v1h-1z M93,28h1v1h-1z M48,29h1v1h-1z M78,29h1v1h-1z M43,30h1v1h-1z M83,30h1v1h-1z M42,31h1v1h-1z M56,31h1v1h-1z M60,31h1v1h-1z M66,31h1v1h-1z M70,31h1v1h-1z M84,31h1v1h-1z M36,32h1v1h-1z M90,32h1v1h-1z M33,33h1v1h-1z M43,33h1v1h-1z M83,33h1v1h-1z M93,33h1v1h-1z M34,34h1v1h-1z M92,34h1v1h-1z M61,14h1v2h-1z M65,14h1v2h-1z M56,16h1v13h-1z M59,16h1v3h-1z M63,16h1v14h-1z M67,16h1v3h-1z M70,16h1v13h-1z M51,17h1v2h-1z M58,17h1v9h-1z M60,17h1v13h-1z M66,17h1v13h-1z M68,17h1v9h-1z M75,17h1v2h-1z M48,18h1v10h-1z M53,18h1v8h-1z M62,18h1v10h-1z M64,18h1v10h-1z M73,18h1v8h-1z M78,18h1v10h-1z M44,19h1v12h-1z M55,19h1v8h-1z M61,19h1v10h-1z M65,19h1v10h-1z M71,19h1v8h-1z M82,19h1v12h-1z M49,20h1v9h-1z M52,20h1v9h-1z M59,20h1v8h-1z M67,20h1v8h-1z M74,20h1v9h-1z M77,20h1v9h-1z M46,21h1v7h-1z M50,21h1v7h-1z M54,21h1v7h-1z M57,21h1v8h-1z M69,21h1v8h-1z M72,21h1v7h-1z M76,21h1v7h-1z M80,21h1v7h-1z M41,22h1v9h-1z M45,22h1v7h-1z M51,22h1v7h-1z M75,22h1v7h-1z M81,22h1v7h-1z M85,22h1v9h-1z M34,23h1v2h-1z M37,23h1v9h-1z M42,23h2v7h-2z M47,23h1v4h-1z M79,23h1v4h-1z M83,23h2v7h-2z M89,23h1v9h-1z M92,23h1v2h-1z M38,24h1v8h-1z M40,24h1v7h-1z M86,24h1v7h-1z M88,24h1v8h-1z M35,26h2v4h-2z M90,26h2v4h-2z M39,27h1v3h-1z M87,27h1v3h-1z M47,30h1v2h-1z M79,30h1v2h-1z M44,32h1v2h-1z M82,32h1v2h-1z M35,33h1v3h-1z M91,33h1v3h-1z"
          />
          <path
            fill="#CAB49F"
            d="M48,28h1v1h-1z M78,28h1v1h-1z M42,30h1v1h-1z M60,30h1v1h-1z M63,30h1v1h-1z M66,30h1v1h-1z M84,30h1v1h-1z M35,32h1v1h-1z M91,32h1v1h-1z M42,33h1v1h-1z M84,33h1v1h-1z M38,35h1v1h-1z M88,35h1v1h-1z M53,26h1v6h-1z M58,26h1v5h-1z M68,26h1v5h-1z M73,26h1v6h-1z M47,27h1v3h-1z M55,27h1v4h-1z M71,27h1v4h-1z M79,27h1v3h-1z M34,28h1v6h-1z M46,28h1v6h-1z M50,28h1v4h-1z M54,28h1v4h-1z M59,28h1v3h-1z M62,28h1v3h-1z M64,28h1v3h-1z M67,28h1v3h-1z M72,28h1v4h-1z M76,28h1v4h-1z M80,28h1v6h-1z M92,28h1v6h-1z M32,29h2v2h-2z M45,29h1v4h-1z M49,29h1v3h-1z M51,29h2v4h-2z M56,29h2v2h-2z M61,29h1v3h-1z M65,29h1v3h-1z M69,29h2v2h-2z M74,29h2v4h-2z M77,29h1v3h-1z M81,29h1v4h-1z M93,29h2v2h-2z M35,30h2v2h-2z M39,30h1v6h-1z M48,30h1v2h-1z M78,30h1v2h-1z M87,30h1v6h-1z M90,30h2v2h-2z M33,31h1v2h-1z M40,31h2v4h-2z M43,31h2v1h-2z M82,31h2v1h-2z M85,31h2v4h-2z M93,31h1v2h-1z M37,32h2v3h-2z M42,32h2v1h-2z M83,32h2v1h-2z M88,32h2v3h-2z M36,33h1v2h-1z M90,33h1v2h-1z"
          />
          <path
            fill="#5D2E1D"
            d="M56,33h1v1h-1z M70,33h1v1h-1z M55,32h1v2h-1z M57,32h3v1h-3z M62,32h3v1h-3z M67,32h3v1h-3z M71,32h1v2h-1z M48,33h3v2h-3z M53,33h2v2h-2z M72,33h2v2h-2z M76,33h3v2h-3z M45,34h1v3h-1z M47,34h1v2h-1z M51,34h2v1h-2z M74,34h2v1h-2z M79,34h1v2h-1z M81,34h1v3h-1z M42,35h3v2h-3z M46,35h1v2h-1z M48,35h2v1h-2z M77,35h2v1h-2z M80,35h1v2h-1z M82,35h3v2h-3z M36,36h2v1h-2z M40,36h2v1h-2z M85,36h2v1h-2z M89,36h2v1h-2z"
          />
          <path
            fill="#704326"
            d="M30,38h1v1h-1z M96,38h1v1h-1z M29,39h1v1h-1z M97,39h1v1h-1z M35,41h1v1h-1z M91,41h1v1h-1z M33,43h1v1h-1z M93,43h1v1h-1z M31,46h1v1h-1z M95,46h1v1h-1z M31,51h1v1h-1z M95,51h1v1h-1z M31,60h1v1h-1z M95,60h1v1h-1z M29,67h1v1h-1z M97,67h1v1h-1z M32,71h1v1h-1z M94,71h1v1h-1z M34,74h1v1h-1z M92,74h1v1h-1z M39,82h1v1h-1z M87,82h1v1h-1z M57,33h13v2h-13z M55,34h2v1h-2z M70,34h2v1h-2z M50,35h6v1h-6z M71,35h6v1h-6z M33,36h2v7h-2z M47,36h5v1h-5z M75,36h5v1h-5z M92,36h2v7h-2z M31,37h2v2h-2z M35,37h13v1h-13z M79,37h13v1h-13z M94,37h2v2h-2z M35,38h10v1h-10z M82,38h10v1h-10z M35,39h6v1h-6z M86,39h6v1h-6z M31,40h2v6h-2z M35,40h5v1h-5z M87,40h5v1h-5z M94,40h2v6h-2z M30,41h1v6h-1z M96,41h1v6h-1z M29,44h1v9h-1z M97,44h1v9h-1z M30,49h1v2h-1z M96,49h1v2h-1z M30,52h1v18h-1z M96,52h1v18h-1z M28,53h1v4h-1z M98,53h1v4h-1z M29,54h1v11h-1z M97,54h1v11h-1z M31,65h2v1h-2z M94,65h2v1h-2z M31,66h1v8h-1z M95,66h1v8h-1z M33,73h1v4h-1z M93,73h1v4h-1z M32,74h1v2h-1z M94,74h1v2h-1z M34,76h1v2h-1z M92,76h1v2h-1z M35,78h1v2h-1z M91,78h1v2h-1z M36,79h1v2h-1z M90,79h1v2h-1z M37,80h1v2h-1z M89,80h1v2h-1z M38,81h1v3h-1z M88,81h1v3h-1z"
          />
          <path
            fill="#AD9885"
            d="M45,39h1v1h-1z M81,39h1v1h-1z M42,41h1v1h-1z M84,41h1v1h-1z M35,42h1v1h-1z M41,42h1v1h-1z M85,42h1v1h-1z M91,42h1v1h-1z M36,43h1v1h-1z M40,43h1v1h-1z M86,43h1v1h-1z M90,43h1v1h-1z M35,44h1v1h-1z M91,44h1v1h-1z M35,46h1v1h-1z M91,46h1v1h-1z M34,48h1v1h-1z M92,48h1v1h-1z M32,49h1v1h-1z M94,49h1v1h-1z M33,50h1v1h-1z M93,50h1v1h-1z M33,53h1v1h-1z M93,53h1v1h-1z M31,54h1v1h-1z M95,54h1v1h-1z M33,55h1v1h-1z M93,55h1v1h-1z M31,56h1v1h-1z M95,56h1v1h-1z M32,58h1v1h-1z M94,58h1v1h-1z M31,59h1v1h-1z M33,59h1v1h-1z M93,59h1v1h-1z M95,59h1v1h-1z M32,63h1v1h-1z M94,63h1v1h-1z M33,65h1v1h-1z M93,65h1v1h-1z M32,66h1v1h-1z M94,66h1v1h-1z M33,72h1v1h-1z M93,72h1v1h-1z M34,73h1v1h-1z M92,73h1v1h-1z M34,75h1v1h-1z M92,75h1v1h-1z M38,77h1v1h-1z M40,77h1v1h-1z M86,77h1v1h-1z M88,77h1v1h-1z M37,79h1v1h-1z M89,79h1v1h-1z M38,80h1v1h-1z M40,80h1v1h-1z M86,80h1v1h-1z M88,80h1v1h-1z M56,35h15v1h-15z M52,36h4v1h-4z M71,36h4v1h-4z M48,37h4v1h-4z M75,37h4v1h-4z M45,38h4v1h-4z M78,38h4v1h-4z M41,39h3v1h-3z M83,39h3v1h-3z M40,40h2v1h-2z M85,40h2v1h-2z M36,41h3v1h-3z M88,41h3v1h-3z M37,42h3v1h-3z M87,42h3v1h-3z M34,43h1v3h-1z M92,43h1v3h-1z M33,44h1v2h-1z M93,44h1v2h-1z M36,45h2v1h-2z M89,45h2v1h-2z M32,46h1v2h-1z M94,46h1v2h-1z M31,47h1v4h-1z M33,47h1v2h-1z M93,47h1v2h-1z M95,47h1v4h-1z M31,52h2v2h-2z M94,52h2v2h-2z M32,57h2v1h-2z M93,57h2v1h-2z M32,61h2v2h-2z M93,61h2v2h-2z M31,62h1v2h-1z M95,62h1v2h-1z M34,67h1v2h-1z M92,67h1v2h-1z M33,68h1v2h-1z M93,68h1v2h-1z M33,71h2v1h-2z M92,71h2v1h-2z M35,72h1v2h-1z M91,72h1v2h-1z M36,74h1v3h-1z M90,74h1v3h-1z M35,76h1v2h-1z M91,76h1v2h-1z M36,78h2v1h-2z M39,78h1v2h-1z M87,78h1v2h-1z M89,78h2v1h-2z"
          />
          <path
            fill="#C5B9AB"
            d="M44,39h1v1h-1z M82,39h1v1h-1z M36,42h1v1h-1z M40,42h1v1h-1z M86,42h1v1h-1z M90,42h1v1h-1z M35,43h1v1h-1z M91,43h1v1h-1z M35,45h1v1h-1z M91,45h1v1h-1z M36,46h1v1h-1z M90,46h1v1h-1z M32,48h1v1h-1z M94,48h1v1h-1z M33,58h1v1h-1z M93,58h1v1h-1z M33,60h1v1h-1z M93,60h1v1h-1z M31,61h1v1h-1z M95,61h1v1h-1z M32,64h1v1h-1z M94,64h1v1h-1z M33,70h1v1h-1z M93,70h1v1h-1z M34,72h1v1h-1z M92,72h1v1h-1z M36,73h1v1h-1z M90,73h1v1h-1z M36,77h1v1h-1z M90,77h1v1h-1z M42,40h2v1h-2z M83,40h2v1h-2z M39,41h3v1h-3z M85,41h3v1h-3z M37,43h3v1h-3z M87,43h3v1h-3z M36,44h3v1h-3z M88,44h3v1h-3z M33,46h2v1h-2z M92,46h2v1h-2z M34,47h2v1h-2z M91,47h2v1h-2z M33,49h2v1h-2z M92,49h2v1h-2z M32,50h1v2h-1z M94,50h1v2h-1z M33,51h1v2h-1z M93,51h1v2h-1z M32,54h2v1h-2z M93,54h2v1h-2z M31,55h2v1h-2z M94,55h2v1h-2z M32,56h2v1h-2z M93,56h2v1h-2z M31,57h1v2h-1z M95,57h1v2h-1z M32,59h1v2h-1z M94,59h1v2h-1z M33,63h1v2h-1z M93,63h1v2h-1z M34,65h1v2h-1z M92,65h1v2h-1z M33,66h1v2h-1z M93,66h1v2h-1z M32,67h1v2h-1z M94,67h1v2h-1z M34,69h1v2h-1z M92,69h1v2h-1z M35,70h1v2h-1z M91,70h1v2h-1z M35,74h1v2h-1z M37,74h1v4h-1z M89,74h1v4h-1z M91,74h1v2h-1z M38,75h1v2h-1z M88,75h1v2h-1z M39,76h1v2h-1z M87,76h1v2h-1z M38,78h1v2h-1z M40,78h1v2h-1z M86,78h1v2h-1z M88,78h1v2h-1z M39,80h1v2h-1z M87,80h1v2h-1z"
          />
        </g>
      );
    case 2: // captain
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M32,11h1v1h-1z M94,11h1v1h-1z M30,22h1v1h-1z M96,22h1v1h-1z M31,23h1v1h-1z M95,23h1v1h-1z M32,24h1v1h-1z M94,24h1v1h-1z M36,30h1v1h-1z M90,30h1v1h-1z M34,42h1v1h-1z M92,42h1v1h-1z M35,43h1v1h-1z M91,43h1v1h-1z M57,2h13v1h-13z M51,3h6v1h-6z M70,3h6v1h-6z M45,4h6v1h-6z M76,4h6v1h-6z M43,5h2v1h-2z M82,5h2v1h-2z M41,6h2v1h-2z M84,6h2v1h-2z M39,7h2v1h-2z M86,7h2v1h-2z M37,8h2v1h-2z M88,8h2v1h-2z M35,9h2v1h-2z M90,9h2v1h-2z M33,10h2v1h-2z M92,10h2v1h-2z M31,12h1v2h-1z M95,12h1v2h-1z M30,14h1v3h-1z M96,14h1v3h-1z M29,17h1v5h-1z M97,17h1v5h-1z M50,21h27v3h-27z M47,22h3v1h-3z M77,22h3v1h-3z M44,23h3v1h-3z M80,23h3v1h-3z M39,24h5v1h-5z M50,24h8v1h-8z M69,24h8v1h-8z M83,24h5v1h-5z M33,25h2v1h-2z M37,25h2v1h-2z M88,25h2v1h-2z M92,25h2v1h-2z M35,26h3v1h-3z M58,26h11v2h-11z M89,26h3v1h-3z M36,27h1v2h-1z M50,27h8v1h-8z M69,27h8v1h-8z M90,27h1v2h-1z M49,28h2v1h-2z M76,28h2v1h-2z M51,30h25v4h-25z M49,31h2v3h-2z M76,31h2v3h-2z M35,32h1v4h-1z M91,32h1v4h-1z M42,34h8v1h-8z M77,34h8v1h-8z M36,35h6v1h-6z M85,35h6v1h-6z M34,36h1v2h-1z M92,36h1v2h-1z M33,38h1v4h-1z M93,38h1v4h-1z M36,44h5v1h-5z M57,44h13v1h-13z M86,44h5v1h-5z M41,45h16v1h-16z M70,45h16v1h-16z"
          />
          <path
            fill="#E0E0DE"
            d="M57,3h13v1h-13z M51,4h8v1h-8z M68,4h8v1h-8z M46,5h12v2h-12z M69,5h12v2h-12z M47,7h11v3h-11z M69,7h11v3h-11z M48,10h10v3h-10z M69,10h10v3h-10z M49,13h9v3h-9z M69,13h9v3h-9z M50,16h8v3h-8z M69,16h8v3h-8z M58,18h1v3h-1z M68,18h1v3h-1z M51,19h7v2h-7z M59,19h1v2h-1z M67,19h1v2h-1z M69,19h7v2h-7z M60,20h7v1h-7z"
          />
          <path
            fill="#222223"
            d="M65,6h1v1h-1z M61,15h1v1h-1z M58,17h1v1h-1z M59,18h1v1h-1z M59,4h5v1h-5z M66,4h2v4h-2z M58,5h4v5h-4z M68,5h1v13h-1z M62,8h1v2h-1z M67,8h1v5h-1z M58,10h3v6h-3z M65,11h2v2h-2z M61,14h2v1h-2z M58,16h2v1h-2z M67,16h1v3h-1z M65,17h2v3h-2z M63,18h2v2h-2z M60,19h3v1h-3z M50,34h27v5h-27z M49,35h1v2h-1z M77,35h1v2h-1z M51,39h25v1h-25z M52,40h23v1h-23z M54,41h19v1h-19z M56,42h15v1h-15z M58,43h11v1h-11z"
          />
          <path
            fill="#F1CB2F"
            d="M66,16h1v1h-1z M59,17h1v1h-1z M64,17h1v1h-1z M62,18h1v1h-1z M58,24h1v1h-1z M60,24h1v1h-1z M62,24h1v1h-1z M64,24h1v1h-1z M66,24h1v1h-1z M68,24h1v1h-1z M50,25h1v1h-1z M52,25h1v1h-1z M54,25h1v1h-1z M56,25h1v1h-1z M70,25h1v1h-1z M72,25h1v1h-1z M74,25h1v1h-1z M76,25h1v1h-1z M46,26h1v1h-1z M48,26h1v1h-1z M78,26h1v1h-1z M80,26h1v1h-1z M42,27h1v1h-1z M44,27h1v1h-1z M82,27h1v1h-1z M84,27h1v1h-1z M40,28h1v1h-1z M52,28h1v1h-1z M54,28h1v1h-1z M56,28h1v1h-1z M58,28h1v1h-1z M60,28h1v1h-1z M62,28h1v1h-1z M64,28h1v1h-1z M66,28h1v1h-1z M68,28h1v1h-1z M70,28h1v1h-1z M72,28h1v1h-1z M74,28h1v1h-1z M86,28h1v1h-1z M36,29h1v1h-1z M46,29h1v1h-1z M48,29h1v1h-1z M50,29h1v1h-1z M76,29h1v1h-1z M78,29h1v1h-1z M80,29h1v1h-1z M90,29h1v1h-1z M35,30h1v1h-1z M40,30h1v1h-1z M42,30h1v1h-1z M44,30h1v1h-1z M82,30h1v1h-1z M84,30h1v1h-1z M86,30h1v1h-1z M91,30h1v1h-1z M64,4h2v2h-2z M62,5h2v2h-2z M65,8h2v3h-2z M63,9h2v3h-2z M61,10h2v3h-2z M66,13h2v3h-2z M64,14h2v3h-2z M62,15h2v3h-2z M60,16h2v3h-2z M38,29h1v2h-1z M88,29h1v2h-1z"
          />
          <path
            fill="#D6D6D6"
            d="M34,12h1v1h-1z M92,12h1v1h-1z M40,23h1v1h-1z M43,23h1v1h-1z M83,23h1v1h-1z M86,23h1v1h-1z M45,5h1v18h-1z M81,5h1v18h-1z M43,6h2v17h-2z M82,6h2v17h-2z M41,7h2v17h-2z M46,7h1v16h-1z M80,7h1v16h-1z M84,7h2v17h-2z M39,8h2v15h-2z M86,8h2v15h-2z M37,9h2v10h-2z M88,9h2v10h-2z M35,10h2v5h-2z M47,10h1v12h-1z M79,10h1v12h-1z M90,10h2v5h-2z M33,11h2v1h-2z M92,11h2v1h-2z M48,13h1v9h-1z M78,13h1v9h-1z M36,15h1v2h-1z M90,15h1v2h-1z M49,16h1v6h-1z M77,16h1v6h-1z M38,19h1v2h-1z M50,19h1v2h-1z M76,19h1v2h-1z M88,19h1v2h-1z"
          />
          <path
            fill="#E7A417"
            d="M64,6h1v1h-1z M60,25h1v1h-1z M62,25h1v1h-1z M64,25h1v1h-1z M66,25h1v1h-1z M52,26h1v1h-1z M54,26h1v1h-1z M72,26h1v1h-1z M74,26h1v1h-1z M46,27h1v1h-1z M80,27h1v1h-1z M44,28h1v1h-1z M82,28h1v1h-1z M37,29h1v1h-1z M52,29h1v1h-1z M54,29h1v1h-1z M56,29h1v1h-1z M58,29h1v1h-1z M60,29h1v1h-1z M62,29h1v1h-1z M64,29h1v1h-1z M66,29h1v1h-1z M68,29h1v1h-1z M70,29h1v1h-1z M72,29h1v1h-1z M74,29h1v1h-1z M89,29h1v1h-1z M43,30h1v1h-1z M46,30h1v1h-1z M48,30h1v1h-1z M50,30h1v1h-1z M76,30h1v1h-1z M78,30h1v1h-1z M80,30h1v1h-1z M83,30h1v1h-1z M35,31h1v1h-1z M40,31h1v1h-1z M42,31h1v1h-1z M84,31h1v1h-1z M86,31h1v1h-1z M91,31h1v1h-1z M62,7h2v1h-2z M63,12h2v1h-2z M61,13h2v1h-2z M59,24h1v2h-1z M61,24h1v2h-1z M63,24h1v2h-1z M65,24h1v2h-1z M67,24h1v2h-1z M51,25h1v2h-1z M53,25h1v2h-1z M55,25h1v2h-1z M57,25h2v1h-2z M68,25h2v1h-2z M71,25h1v2h-1z M73,25h1v2h-1z M75,25h1v2h-1z M45,26h1v2h-1z M47,26h1v2h-1z M49,26h2v1h-2z M56,26h2v1h-2z M69,26h2v1h-2z M76,26h2v1h-2z M79,26h1v2h-1z M81,26h1v2h-1z M43,27h1v2h-1z M48,27h2v1h-2z M77,27h2v1h-2z M83,27h1v2h-1z M41,28h2v1h-2z M51,28h1v2h-1z M53,28h1v2h-1z M55,28h1v2h-1z M57,28h1v2h-1z M59,28h1v2h-1z M61,28h1v2h-1z M63,28h1v2h-1z M65,28h1v2h-1z M67,28h1v2h-1z M69,28h1v2h-1z M71,28h1v2h-1z M73,28h1v2h-1z M75,28h1v2h-1z M84,28h2v1h-2z M39,29h3v1h-3z M45,29h1v2h-1z M47,29h1v2h-1z M49,29h1v2h-1z M77,29h1v2h-1z M79,29h1v2h-1z M81,29h1v2h-1z M85,29h3v1h-3z M39,30h1v2h-1z M41,30h1v2h-1z M85,30h1v2h-1z M87,30h1v2h-1z M37,31h2v1h-2z M88,31h2v1h-2z M36,32h2v1h-2z M89,32h2v1h-2z"
          />
          <path
            fill="#D06F0B"
            d="M63,14h1v1h-1z M64,7h2v1h-2z M63,8h2v1h-2z M63,13h3v1h-3z"
          />
          <path
            fill="#B0B1B3"
            d="M39,23h1v1h-1z M87,23h1v1h-1z M33,24h1v1h-1z M93,24h1v1h-1z M32,12h2v12h-2z M93,12h2v12h-2z M34,13h1v12h-1z M92,13h1v12h-1z M31,14h1v9h-1z M95,14h1v9h-1z M35,15h1v11h-1z M91,15h1v11h-1z M30,17h1v5h-1z M36,17h1v9h-1z M90,17h1v9h-1z M96,17h1v5h-1z M37,19h1v6h-1z M89,19h1v6h-1z M38,21h1v4h-1z M88,21h1v4h-1z"
          />
          <path
            fill="#4B4C4E"
            d="M44,26h1v1h-1z M82,26h1v1h-1z M37,30h1v1h-1z M89,30h1v1h-1z M36,31h1v1h-1z M90,31h1v1h-1z M41,34h1v1h-1z M85,34h1v1h-1z M47,23h3v3h-3z M77,23h3v3h-3z M44,24h3v2h-3z M80,24h3v2h-3z M42,25h2v2h-2z M83,25h2v2h-2z M38,26h1v3h-1z M88,26h1v3h-1z M37,27h1v2h-1z M89,27h1v2h-1z M45,28h4v1h-4z M78,28h4v1h-4z M42,29h3v1h-3z M82,29h3v1h-3z M43,31h6v3h-6z M78,31h6v3h-6z M41,32h2v2h-2z M84,32h2v2h-2z M36,33h2v2h-2z M89,33h2v2h-2z"
          />
          <path
            fill="#323234"
            d="M39,28h1v1h-1z M87,28h1v1h-1z M39,25h3v3h-3z M85,25h3v3h-3z M38,32h3v3h-3z M86,32h3v3h-3z"
          />
          <path
            fill="#333334"
            d="M41,44h1v1h-1z M56,44h1v1h-1z M70,44h1v1h-1z M85,44h1v1h-1z M42,35h7v10h-7z M78,35h7v10h-7z M35,36h7v7h-7z M85,36h7v7h-7z M49,37h1v8h-1z M77,37h1v8h-1z M34,38h1v4h-1z M92,38h1v4h-1z M50,39h1v6h-1z M76,39h1v6h-1z M51,40h1v5h-1z M75,40h1v5h-1z M52,41h2v4h-2z M73,41h2v4h-2z M54,42h2v3h-2z M71,42h2v3h-2z M36,43h6v1h-6z M56,43h2v1h-2z M69,43h2v1h-2z M85,43h6v1h-6z"
          />
        </g>
      );
    case 3: // cowboy
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M54,6h1v1h-1z M72,6h1v1h-1z M55,7h1v1h-1z M71,7h1v1h-1z M43,21h1v1h-1z M83,21h1v1h-1z M22,22h1v1h-1z M104,22h1v1h-1z M27,23h1v1h-1z M99,23h1v1h-1z M40,24h1v1h-1z M86,24h1v1h-1z M23,28h1v1h-1z M103,28h1v1h-1z M24,29h1v1h-1z M102,29h1v1h-1z M35,35h1v1h-1z M91,35h1v1h-1z M34,36h1v1h-1z M92,36h1v1h-1z M25,40h1v1h-1z M101,40h1v1h-1z M26,41h1v1h-1z M100,41h1v1h-1z M27,42h1v1h-1z M99,42h1v1h-1z M50,5h4v1h-4z M73,5h4v1h-4z M49,6h1v2h-1z M77,6h1v2h-1z M48,8h1v2h-1z M56,8h4v1h-4z M67,8h4v1h-4z M78,8h1v2h-1z M60,9h7v1h-7z M47,10h1v2h-1z M79,10h1v2h-1z M46,12h1v2h-1z M80,12h1v2h-1z M45,14h1v2h-1z M81,14h1v2h-1z M44,16h1v2h-1z M82,16h1v2h-1z M43,18h1v2h-1z M83,18h1v2h-1z M42,20h1v2h-1z M84,20h1v2h-1z M23,21h2v1h-2z M102,21h2v1h-2z M25,22h2v1h-2z M41,22h1v2h-1z M44,22h7v1h-7z M76,22h7v1h-7z M85,22h1v2h-1z M100,22h2v1h-2z M21,23h1v7h-1z M51,23h5v1h-5z M71,23h5v1h-5z M105,23h1v7h-1z M28,24h2v1h-2z M56,24h15v1h-15z M97,24h2v1h-2z M30,25h3v1h-3z M38,25h2v2h-2z M87,25h2v2h-2z M94,25h3v1h-3z M22,26h1v2h-1z M33,26h5v1h-5z M40,26h4v1h-4z M83,26h4v1h-4z M89,26h5v1h-5z M104,26h1v2h-1z M44,27h4v1h-4z M79,27h4v1h-4z M48,28h5v1h-5z M74,28h5v1h-5z M53,29h21v1h-21z M22,30h1v5h-1z M25,30h3v1h-3z M99,30h3v1h-3z M104,30h1v5h-1z M28,31h5v1h-5z M94,31h5v1h-5z M33,32h5v1h-5z M89,32h5v1h-5z M36,33h1v2h-1z M38,33h3v1h-3z M86,33h3v1h-3z M90,33h1v2h-1z M41,34h2v1h-2z M84,34h2v1h-2z M23,35h1v3h-1z M43,35h3v1h-3z M81,35h3v1h-3z M103,35h1v3h-1z M46,36h2v1h-2z M79,36h2v1h-2z M24,37h1v3h-1z M33,37h1v2h-1z M48,37h3v1h-3z M76,37h3v1h-3z M93,37h1v2h-1z M102,37h1v3h-1z M51,38h4v1h-4z M72,38h4v1h-4z M32,39h1v2h-1z M55,39h5v1h-5z M67,39h5v1h-5z M94,39h1v2h-1z M60,40h7v1h-7z M31,41h1v2h-1z M95,41h1v2h-1z M28,43h3v1h-3z M96,43h3v1h-3z"
          />
          <path
            fill="#8F6F4A"
            d="M43,20h1v1h-1z M83,20h1v1h-1z M22,23h1v1h-1z M104,23h1v1h-1z M24,25h1v1h-1z M102,25h1v1h-1z M26,26h1v1h-1z M100,26h1v1h-1z M50,6h2v1h-2z M75,6h2v1h-2z M50,7h1v2h-1z M76,7h1v2h-1z M49,8h1v5h-1z M77,8h1v5h-1z M58,9h2v1h-2z M67,9h2v1h-2z M48,10h1v5h-1z M60,10h7v1h-7z M78,10h1v5h-1z M62,11h3v1h-3z M47,12h1v6h-1z M79,12h1v6h-1z M46,14h1v7h-1z M80,14h1v7h-1z M45,16h1v6h-1z M81,16h1v6h-1z M44,18h1v4h-1z M82,18h1v4h-1z M23,22h2v3h-2z M102,22h2v3h-2z M25,23h2v3h-2z M100,23h2v3h-2z M27,24h1v4h-1z M99,24h1v4h-1z M28,25h2v3h-2z M97,25h2v3h-2z M30,26h3v3h-3z M94,26h3v3h-3z M33,27h8v2h-8z M86,27h8v2h-8z M41,28h3v1h-3z M83,28h3v1h-3z M34,29h5v1h-5z M88,29h5v1h-5z M36,30h5v1h-5z M86,30h5v1h-5z M41,31h4v1h-4z M82,31h4v1h-4z M45,32h2v1h-2z M80,32h2v1h-2z M47,33h3v1h-3z M77,33h3v1h-3z M50,34h3v1h-3z M74,34h3v1h-3z M53,35h5v1h-5z M69,35h5v1h-5z M58,36h11v1h-11z"
          />
          <path
            fill="#734D36"
            d="M54,7h1v1h-1z M72,7h1v1h-1z M55,8h1v1h-1z M71,8h1v1h-1z M46,21h1v1h-1z M80,21h1v1h-1z M25,29h1v1h-1z M101,29h1v1h-1z M33,31h1v1h-1z M93,31h1v1h-1z M47,32h1v1h-1z M79,32h1v1h-1z M52,6h2v1h-2z M73,6h2v1h-2z M51,7h1v16h-1z M75,7h1v16h-1z M50,9h1v13h-1z M56,9h2v1h-2z M69,9h2v1h-2z M76,9h1v13h-1z M52,10h1v13h-1z M59,10h1v14h-1z M67,10h1v14h-1z M74,10h1v13h-1z M53,11h1v12h-1z M58,11h1v13h-1z M60,11h2v13h-2z M65,11h2v13h-2z M68,11h1v13h-1z M73,11h1v12h-1z M54,12h4v11h-4z M62,12h3v12h-3z M69,12h4v11h-4z M49,13h1v9h-1z M77,13h1v9h-1z M48,15h1v7h-1z M78,15h1v7h-1z M47,18h1v4h-1z M79,18h1v4h-1z M56,23h2v1h-2z M69,23h2v1h-2z M22,24h1v2h-1z M104,24h1v2h-1z M23,25h1v3h-1z M103,25h1v3h-1z M24,26h2v3h-2z M101,26h2v3h-2z M26,27h1v3h-1z M41,27h3v1h-3z M83,27h3v1h-3z M100,27h1v3h-1z M27,28h3v2h-3z M44,28h4v3h-4z M79,28h4v3h-4z M97,28h3v2h-3z M30,29h4v2h-4z M39,29h5v1h-5z M48,29h5v4h-5z M74,29h5v4h-5z M83,29h5v1h-5z M93,29h4v2h-4z M28,30h2v1h-2z M34,30h2v2h-2z M41,30h3v1h-3z M53,30h21v5h-21z M83,30h3v1h-3z M91,30h2v2h-2z M97,30h2v1h-2z M36,31h5v1h-5z M45,31h3v1h-3z M79,31h3v1h-3z M86,31h5v1h-5z M38,32h7v1h-7z M82,32h7v1h-7z M41,33h6v1h-6z M50,33h3v1h-3z M74,33h3v1h-3z M80,33h6v1h-6z M43,34h7v1h-7z M77,34h7v1h-7z M46,35h7v1h-7z M58,35h11v1h-11z M74,35h7v1h-7z M48,36h10v1h-10z M69,36h10v1h-10z M51,37h25v1h-25z M55,38h17v1h-17z M60,39h7v1h-7z"
          />
          <path
            fill="#49322B"
            d="M53,10h1v1h-1z M73,10h1v1h-1z M33,36h1v1h-1z M93,36h1v1h-1z M52,7h2v3h-2z M73,7h2v3h-2z M54,8h1v4h-1z M72,8h1v4h-1z M55,9h1v3h-1z M71,9h1v3h-1z M56,10h3v1h-3z M68,10h3v1h-3z M56,11h2v1h-2z M69,11h2v1h-2z M22,28h1v2h-1z M104,28h1v2h-1z M23,29h1v6h-1z M103,29h1v6h-1z M24,30h1v7h-1z M102,30h1v7h-1z M25,31h3v9h-3z M99,31h3v9h-3z M28,32h5v7h-5z M94,32h5v7h-5z M33,33h3v2h-3z M91,33h3v2h-3z M33,35h2v1h-2z M92,35h2v1h-2z M28,39h4v2h-4z M95,39h4v2h-4z M26,40h2v1h-2z M99,40h2v1h-2z M27,41h4v1h-4z M96,41h4v1h-4z M28,42h3v1h-3z M96,42h3v1h-3z"
          />
          <path
            fill="#C19C45"
            d="M40,25h1v1h-1z M86,25h1v1h-1z M42,22h2v4h-2z M83,22h2v4h-2z M44,23h2v2h-2z M81,23h2v2h-2z M41,24h1v2h-1z M85,24h1v2h-1z M44,25h1v2h-1z M82,25h1v2h-1z"
          />
          <path
            fill="#A47033"
            d="M46,23h5v4h-5z M76,23h5v4h-5z M51,24h5v4h-5z M71,24h5v4h-5z M45,25h1v2h-1z M56,25h15v4h-15z M81,25h1v2h-1z M48,27h3v1h-3z M76,27h3v1h-3z M53,28h3v1h-3z M71,28h3v1h-3z"
          />
        </g>
      );
    case 4: // crocodile
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M46,7h1v1h-1z M80,7h1v1h-1z M43,20h1v1h-1z M46,20h1v1h-1z M80,20h1v1h-1z M83,20h1v1h-1z M45,21h1v1h-1z M63,21h1v1h-1z M81,21h1v1h-1z M53,22h1v1h-1z M56,22h1v1h-1z M70,22h1v1h-1z M73,22h1v1h-1z M45,30h1v1h-1z M81,30h1v1h-1z M24,31h1v1h-1z M102,31h1v1h-1z M25,32h1v1h-1z M101,32h1v1h-1z M26,33h1v1h-1z M58,33h1v1h-1z M60,33h1v1h-1z M66,33h1v1h-1z M68,33h1v1h-1z M100,33h1v1h-1z M58,4h11v1h-11z M49,5h9v1h-9z M69,5h9v1h-9z M47,6h2v1h-2z M78,6h2v1h-2z M45,8h1v3h-1z M81,8h1v3h-1z M44,11h1v2h-1z M82,11h1v2h-1z M43,13h1v2h-1z M83,13h1v2h-1z M42,15h1v3h-1z M84,15h1v3h-1z M41,18h1v3h-1z M85,18h1v3h-1z M44,19h3v1h-3z M80,19h3v1h-3z M36,21h5v1h-5z M42,21h1v2h-1z M54,21h3v1h-3z M70,21h3v1h-3z M84,21h1v2h-1z M86,21h5v1h-5z M30,22h6v1h-6z M40,22h1v3h-1z M44,22h1v9h-1z M62,22h1v3h-1z M64,22h1v3h-1z M82,22h1v9h-1z M86,22h1v3h-1z M91,22h6v1h-6z M28,23h2v1h-2z M41,23h1v8h-1z M52,23h1v2h-1z M55,23h1v3h-1z M71,23h1v3h-1z M74,23h1v2h-1z M85,23h1v8h-1z M97,23h2v1h-2z M26,24h2v1h-2z M39,24h1v3h-1z M87,24h1v3h-1z M99,24h2v1h-2z M24,25h2v1h-2z M45,25h2v1h-2z M51,25h1v2h-1z M61,25h1v9h-1z M65,25h1v9h-1z M75,25h1v2h-1z M80,25h2v1h-2z M101,25h2v1h-2z M23,26h1v5h-1z M46,26h5v1h-5z M54,26h1v7h-1z M72,26h1v7h-1z M76,26h5v1h-5z M103,26h1v5h-1z M38,27h1v2h-1z M46,27h1v5h-1z M50,27h1v6h-1z M55,27h3v1h-3z M69,27h3v1h-3z M76,27h1v6h-1z M80,27h1v5h-1z M88,27h1v2h-1z M58,28h3v1h-3z M66,28h3v1h-3z M39,29h2v1h-2z M59,29h1v5h-1z M67,29h1v5h-1z M86,29h2v1h-2z M42,31h2v1h-2z M47,31h3v1h-3z M77,31h3v1h-3z M83,31h2v1h-2z M55,32h3v1h-3z M69,32h3v1h-3z M51,33h3v1h-3z M73,33h3v1h-3z M27,34h2v1h-2z M62,34h3v1h-3z M98,34h2v1h-2z M29,35h3v1h-3z M95,35h3v1h-3z M32,36h3v1h-3z M92,36h3v1h-3z M35,37h4v1h-4z M88,37h4v1h-4z M39,38h5v1h-5z M83,38h5v1h-5z M44,39h8v1h-8z M75,39h8v1h-8z M52,40h23v1h-23z"
          />
          <path
            fill="#6F5C53"
            d="M25,29h1v1h-1z M101,29h1v1h-1z M24,30h1v1h-1z M102,30h1v1h-1z M25,31h1v1h-1z M27,31h1v1h-1z M99,31h1v1h-1z M101,31h1v1h-1z M26,32h1v1h-1z M29,32h1v1h-1z M97,32h1v1h-1z M100,32h1v1h-1z M35,34h1v1h-1z M91,34h1v1h-1z M58,5h11v2h-11z M49,6h9v1h-9z M69,6h9v1h-9z M47,7h9v1h-9z M61,7h5v1h-5z M71,7h9v1h-9z M50,8h8v1h-8z M69,8h8v1h-8z M56,9h5v1h-5z M66,9h5v1h-5z M61,10h5v1h-5z M36,22h4v2h-4z M87,22h4v2h-4z M30,23h6v10h-6z M91,23h6v10h-6z M28,24h2v8h-2z M36,24h3v3h-3z M88,24h3v3h-3z M97,24h2v8h-2z M26,25h2v6h-2z M99,25h2v6h-2z M24,26h2v3h-2z M101,26h2v3h-2z M36,27h2v8h-2z M89,27h2v8h-2z M38,29h1v6h-1z M88,29h1v6h-1z M39,30h2v6h-2z M86,30h2v6h-2z M41,31h1v5h-1z M44,31h2v6h-2z M81,31h2v6h-2z M85,31h1v5h-1z M42,32h2v4h-2z M46,32h4v5h-4z M77,32h4v5h-4z M83,32h2v4h-2z M32,33h4v1h-4z M50,33h1v4h-1z M54,33h4v5h-4z M69,33h4v5h-4z M76,33h1v4h-1z M91,33h4v1h-4z M51,34h3v3h-3z M58,34h4v4h-4z M65,34h4v4h-4z M73,34h3v3h-3z M62,35h3v3h-3z M52,37h2v1h-2z M73,37h2v1h-2z"
          />
          <path
            fill="#58413B"
            d="M56,7h5v1h-5z M66,7h5v1h-5z M46,8h1v8h-1z M58,8h11v1h-11z M80,8h1v8h-1z M47,9h3v1h-3z M61,9h5v1h-5z M77,9h3v1h-3z M47,10h2v2h-2z M78,10h2v2h-2z M45,11h1v7h-1z M81,11h1v7h-1z M47,12h1v2h-1z M79,12h1v2h-1z M44,13h1v6h-1z M82,13h1v6h-1z M43,15h1v5h-1z M83,15h1v5h-1z M42,18h1v3h-1z M84,18h1v3h-1z M41,21h1v2h-1z M85,21h1v2h-1z"
          />
          <path
            fill="#89756C"
            d="M24,29h1v1h-1z M102,29h1v1h-1z M25,30h1v1h-1z M101,30h1v1h-1z M26,31h1v1h-1z M100,31h1v1h-1z M47,8h3v1h-3z M77,8h3v1h-3z M50,9h6v1h-6z M71,9h6v1h-6z M56,10h5v1h-5z M66,10h5v1h-5z M61,11h5v1h-5z M27,32h2v1h-2z M98,32h2v1h-2z M29,33h3v1h-3z M95,33h3v1h-3z M32,34h3v1h-3z M92,34h3v1h-3z M35,35h4v1h-4z M88,35h4v1h-4z M39,36h5v1h-5z M83,36h5v1h-5z M44,37h8v1h-8z M75,37h8v1h-8z M52,38h23v1h-23z"
          />
          <path
            fill="#47322E"
            d="M45,18h1v1h-1z M81,18h1v1h-1z M55,26h1v1h-1z M71,26h1v1h-1z M49,10h7v11h-7z M71,10h7v11h-7z M56,11h5v10h-5z M66,11h5v10h-5z M48,12h1v14h-1z M61,12h5v9h-5z M78,12h1v14h-1z M47,14h1v12h-1z M79,14h1v12h-1z M46,16h1v3h-1z M80,16h1v3h-1z M46,21h1v4h-1z M49,21h5v1h-5z M57,21h6v1h-6z M64,21h6v1h-6z M73,21h5v1h-5z M80,21h1v4h-1z M45,22h1v3h-1z M49,22h4v1h-4z M57,22h5v3h-5z M65,22h5v3h-5z M74,22h4v1h-4z M81,22h1v3h-1z M49,23h3v2h-3z M56,23h1v4h-1z M70,23h1v4h-1z M75,23h3v2h-3z M49,25h2v1h-2z M57,25h4v2h-4z M66,25h4v2h-4z M76,25h2v1h-2z M58,27h3v1h-3z M66,27h3v1h-3z M27,33h2v1h-2z M98,33h2v1h-2z M29,34h3v1h-3z M95,34h3v1h-3z M32,35h3v1h-3z M92,35h3v1h-3z M35,36h4v1h-4z M88,36h4v1h-4z M39,37h5v1h-5z M83,37h5v1h-5z M44,38h8v1h-8z M75,38h8v1h-8z M52,39h23v1h-23z"
          />
          <path
            fill="#EBE6D4"
            d="M44,20h1v1h-1z M82,20h1v1h-1z M43,21h1v3h-1z M83,21h1v3h-1z M54,22h2v1h-2z M63,22h1v10h-1z M71,22h2v1h-2z M42,23h1v5h-1z M53,23h2v1h-2z M72,23h2v1h-2z M84,23h1v5h-1z M53,24h1v3h-1z M73,24h1v3h-1z M52,25h1v6h-1z M62,25h1v5h-1z M64,25h1v5h-1z M74,25h1v6h-1z M51,27h1v2h-1z M75,27h1v2h-1z"
          />
          <path
            fill="#C3B7AC"
            d="M45,20h1v1h-1z M81,20h1v1h-1z M44,21h1v1h-1z M82,21h1v1h-1z M43,24h1v7h-1z M54,24h1v2h-1z M72,24h1v2h-1z M83,24h1v7h-1z M53,27h1v6h-1z M73,27h1v6h-1z M42,28h1v3h-1z M84,28h1v3h-1z M51,29h1v4h-1z M75,29h1v4h-1z M62,30h1v4h-1z M64,30h1v4h-1z M52,31h1v2h-1z M74,31h1v2h-1z M63,32h1v2h-1z"
          />
          <path
            fill="#9F6F48"
            d="M40,25h1v1h-1z M86,25h1v1h-1z M47,27h2v1h-2z M78,27h2v1h-2z M56,28h2v1h-2z M69,28h2v1h-2z"
          />
          <path
            fill="#4D1B24"
            d="M58,32h1v1h-1z M68,32h1v1h-1z M40,26h1v3h-1z M86,26h1v3h-1z M39,27h1v2h-1z M87,27h1v2h-1z M45,28h1v2h-1z M47,28h3v3h-3z M77,28h3v3h-3z M81,28h1v2h-1z M55,29h1v3h-1z M71,29h1v3h-1z M56,30h3v2h-3z M60,30h1v3h-1z M66,30h1v3h-1z M68,30h3v2h-3z"
          />
          <path
            fill="#774632"
            d="M49,27h1v1h-1z M77,27h1v1h-1z M55,28h1v1h-1z M71,28h1v1h-1z M60,29h1v1h-1z M66,29h1v1h-1z M45,26h1v2h-1z M81,26h1v2h-1z M56,29h3v1h-3z M68,29h3v1h-3z"
          />
        </g>
      );
    case 5: // crown
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M63,4h1v1h-1z M62,5h1v1h-1z M64,5h1v1h-1z M60,8h1v1h-1z M66,8h1v1h-1z M59,9h1v1h-1z M67,9h1v1h-1z M58,10h1v1h-1z M68,10h1v1h-1z M57,11h1v1h-1z M69,11h1v1h-1z M55,14h1v1h-1z M71,14h1v1h-1z M30,15h1v1h-1z M54,15h1v1h-1z M72,15h1v1h-1z M96,15h1v1h-1z M31,16h1v1h-1z M44,16h1v1h-1z M53,16h1v1h-1z M73,16h1v1h-1z M82,16h1v1h-1z M95,16h1v1h-1z M32,17h1v1h-1z M45,17h1v1h-1z M52,17h1v1h-1z M74,17h1v1h-1z M81,17h1v1h-1z M94,17h1v1h-1z M33,18h1v1h-1z M40,18h1v1h-1z M46,18h1v1h-1z M80,18h1v1h-1z M86,18h1v1h-1z M93,18h1v1h-1z M34,19h1v1h-1z M47,19h1v1h-1z M79,19h1v1h-1z M92,19h1v1h-1z M35,20h1v1h-1z M48,20h1v1h-1z M50,20h1v1h-1z M76,20h1v1h-1z M78,20h1v1h-1z M91,20h1v1h-1z M36,21h1v1h-1z M38,21h1v1h-1z M49,21h1v1h-1z M77,21h1v1h-1z M88,21h1v1h-1z M90,21h1v1h-1z M37,22h1v1h-1z M48,22h1v1h-1z M78,22h1v1h-1z M89,22h1v1h-1z M38,23h1v1h-1z M47,23h1v1h-1z M79,23h1v1h-1z M88,23h1v1h-1z M39,24h1v1h-1z M87,24h1v1h-1z M40,25h1v1h-1z M86,25h1v1h-1z M41,26h1v1h-1z M45,26h1v1h-1z M81,26h1v1h-1z M85,26h1v1h-1z M42,27h1v1h-1z M44,27h1v1h-1z M82,27h1v1h-1z M84,27h1v1h-1z M43,28h1v1h-1z M83,28h1v1h-1z M35,36h1v1h-1z M91,36h1v1h-1z M61,6h1v2h-1z M65,6h1v2h-1z M56,12h1v2h-1z M70,12h1v2h-1z M42,15h2v1h-2z M83,15h2v1h-2z M29,16h1v3h-1z M41,16h1v2h-1z M85,16h1v2h-1z M97,16h1v3h-1z M51,18h1v2h-1z M75,18h1v2h-1z M30,19h1v4h-1z M39,19h1v2h-1z M87,19h1v2h-1z M96,19h1v4h-1z M31,23h1v3h-1z M95,23h1v3h-1z M46,24h1v2h-1z M80,24h1v2h-1z M32,26h1v3h-1z M94,26h1v3h-1z M33,29h1v2h-1z M93,29h1v2h-1z M34,31h1v6h-1z M92,31h1v6h-1z M36,37h2v1h-2z M89,37h2v1h-2z M38,38h3v1h-3z M86,38h3v1h-3z M41,39h4v1h-4z M82,39h4v1h-4z M45,40h7v1h-7z M75,40h7v1h-7z M52,41h23v1h-23z"
          />
          <path
            fill="#FCFFAE"
            d="M93,19h1v1h-1z M83,29h1v1h-1z M36,31h1v1h-1z M63,5h1v32h-1z M60,9h1v6h-1z M59,10h1v15h-1z M58,11h1v24h-1z M57,12h1v25h-1z M56,14h1v23h-1z M55,15h1v21h-1z M54,16h1v20h-1z M53,17h1v19h-1z M52,18h1v17h-1z M31,20h1v3h-1z M51,20h1v5h-1z M92,20h1v2h-1z M91,21h1v2h-1z M32,22h1v4h-1z M90,22h1v2h-1z M89,23h1v3h-1z M33,24h1v5h-1z M88,24h1v3h-1z M87,25h1v3h-1z M86,26h1v4h-1z M34,27h1v4h-1z M85,27h1v4h-1z M84,28h1v3h-1z M35,29h1v2h-1z M35,32h1v4h-1z M36,33h2v4h-2z M38,34h3v1h-3z M41,35h2v1h-2z M38,36h1v2h-1z M43,36h3v1h-3z M46,37h10v1h-10z M53,38h11v1h-11z M53,39h5v2h-5z M63,39h1v2h-1z"
          />
          <path
            fill="#FCE600"
            d="M96,16h1v1h-1z M31,19h1v1h-1z M85,31h1v1h-1z M40,32h1v1h-1z M91,32h1v1h-1z M52,35h1v1h-1z M45,39h1v1h-1z M52,40h1v1h-1z M62,6h1v31h-1z M61,8h1v29h-1z M60,15h1v22h-1z M30,17h1v2h-1z M95,17h1v2h-1z M94,18h1v2h-1z M32,20h1v2h-1z M93,20h1v2h-1z M50,21h1v15h-1z M33,22h1v2h-1z M49,22h1v14h-1z M92,22h1v2h-1z M34,23h1v4h-1z M48,23h1v13h-1z M91,23h1v2h-1z M47,24h1v12h-1z M90,24h1v3h-1z M35,25h1v4h-1z M51,25h1v11h-1z M59,25h1v12h-1z M36,26h1v5h-1z M46,26h1v10h-1z M89,26h1v2h-1z M45,27h1v8h-1z M88,27h1v3h-1z M37,28h1v4h-1z M44,28h1v7h-1z M87,28h1v4h-1z M38,29h1v4h-1z M43,30h1v5h-1z M86,30h1v3h-1z M39,31h1v2h-1z M41,31h2v3h-2z M89,33h2v1h-2z M86,34h3v1h-3z M38,35h3v1h-3z M58,35h1v2h-1z M84,35h2v1h-2z M39,36h4v2h-4z M81,36h3v1h-3z M43,37h3v2h-3z M71,37h10v1h-10z M41,38h2v1h-2z M46,38h7v2h-7z M64,38h7v1h-7z M58,39h5v2h-5z"
          />
          <path
            fill="#FE9505"
            d="M30,16h1v1h-1z M78,21h1v1h-1z M38,22h1v1h-1z M43,29h1v1h-1z M87,32h1v1h-1z M79,35h1v1h-1z M81,39h1v1h-1z M64,6h1v31h-1z M65,8h1v29h-1z M66,9h1v28h-1z M67,11h1v26h-1z M68,13h1v24h-1z M69,15h1v22h-1z M42,16h1v11h-1z M83,16h2v3h-2z M31,17h1v2h-1z M70,17h1v20h-1z M82,17h1v9h-1z M96,17h1v2h-1z M32,18h1v2h-1z M41,18h1v8h-1z M81,18h1v8h-1z M33,19h1v3h-1z M40,19h1v6h-1z M43,19h1v9h-1z M71,19h1v17h-1z M80,19h1v5h-1z M83,19h1v4h-1z M95,19h1v4h-1z M34,20h1v3h-1z M79,20h1v3h-1z M94,20h1v6h-1z M35,21h1v4h-1z M39,21h1v3h-1z M72,21h1v15h-1z M36,22h1v4h-1z M93,22h1v7h-1z M37,23h1v5h-1z M44,23h1v4h-1z M73,23h1v13h-1z M38,24h1v5h-1z M92,24h1v7h-1z M39,25h1v6h-1z M74,25h1v11h-1z M91,25h1v6h-1z M40,26h1v6h-1z M41,27h1v4h-1z M75,27h1v9h-1z M90,27h1v5h-1z M42,28h1v3h-1z M89,28h1v4h-1z M76,29h1v7h-1z M88,30h1v3h-1z M77,31h1v5h-1z M78,33h1v3h-1z M91,33h1v3h-1z M89,34h2v3h-2z M86,35h3v3h-3z M84,36h2v3h-2z M81,37h3v2h-3z M71,38h10v2h-10z M64,39h7v2h-7z M71,40h4v1h-4z"
          />
          <path
            fill="#D46E0A"
            d="M67,10h1v1h-1z M48,21h1v1h-1z M88,22h1v1h-1z M82,26h1v1h-1z M35,31h1v1h-1z M91,31h1v1h-1z M68,11h1v2h-1z M69,12h1v3h-1z M70,14h1v3h-1z M71,15h1v4h-1z M43,16h1v3h-1z M72,16h1v5h-1z M44,17h1v6h-1z M73,17h1v6h-1z M45,18h1v8h-1z M74,18h1v7h-1z M85,18h1v8h-1z M46,19h1v5h-1z M84,19h1v8h-1z M86,19h1v6h-1z M47,20h1v3h-1z M75,20h1v7h-1z M76,21h1v8h-1z M87,21h1v3h-1z M77,22h1v9h-1z M78,23h1v10h-1z M83,23h1v5h-1z M79,24h1v11h-1z M80,26h1v11h-1z M81,27h1v9h-1z M82,28h1v8h-1z M83,30h1v6h-1z M84,31h1v4h-1z M36,32h2v1h-2z M85,32h1v3h-1z M89,32h2v1h-2z M38,33h3v1h-3z M86,33h3v1h-3z M41,34h2v1h-2z M43,35h3v1h-3z M46,36h10v1h-10z M71,36h9v1h-9z M56,37h15v1h-15z"
          />
        </g>
      );
    case 6: // dogecoin
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M63,6h1v1h-1z M48,11h1v1h-1z M78,11h1v1h-1z M45,13h1v1h-1z M81,13h1v1h-1z M44,14h1v1h-1z M82,14h1v1h-1z M43,15h1v1h-1z M83,15h1v1h-1z M42,16h1v1h-1z M59,16h1v1h-1z M84,16h1v1h-1z M40,19h1v1h-1z M59,19h1v1h-1z M62,19h1v1h-1z M86,19h1v1h-1z M58,20h1v1h-1z M36,28h1v1h-1z M90,28h1v1h-1z M35,29h1v1h-1z M91,29h1v1h-1z M34,30h1v1h-1z M92,30h1v1h-1z M34,36h1v1h-1z M92,36h1v1h-1z M35,37h1v1h-1z M91,37h1v1h-1z M36,38h1v1h-1z M90,38h1v1h-1z M61,7h2v1h-2z M64,7h2v1h-2z M57,8h4v1h-4z M66,8h4v1h-4z M53,9h4v1h-4z M70,9h4v1h-4z M49,10h4v1h-4z M74,10h4v1h-4z M46,12h2v1h-2z M79,12h2v1h-2z M62,16h2v1h-2z M41,17h1v2h-1z M85,17h1v2h-1z M58,18h3v1h-3z M39,20h1v2h-1z M60,20h2v1h-2z M87,20h1v2h-1z M38,22h1v2h-1z M88,22h1v2h-1z M37,24h1v5h-1z M89,24h1v5h-1z M38,29h8v1h-8z M81,29h8v1h-8z M46,30h35v1h-35z M33,31h1v5h-1z M93,31h1v5h-1z M55,37h17v1h-17z M50,38h5v1h-5z M72,38h5v1h-5z M37,39h2v1h-2z M48,39h2v1h-2z M77,39h2v1h-2z M88,39h2v1h-2z M39,40h9v1h-9z M79,40h9v1h-9z"
          />
          <path
            fill="#F3EDD7"
            d="M66,11h1v1h-1z M62,12h1v1h-1z M57,15h1v1h-1z M58,16h1v1h-1z M61,16h1v1h-1z M53,28h1v1h-1z M73,28h1v1h-1z M63,7h1v6h-1z M61,8h2v4h-2z M64,8h2v5h-2z M57,9h4v2h-4z M66,9h4v2h-4z M53,10h4v18h-4z M70,10h4v18h-4z M52,11h1v18h-1z M57,11h3v3h-3z M68,11h2v5h-2z M74,11h1v18h-1z M51,12h1v17h-1z M75,12h1v17h-1z M50,13h1v16h-1z M76,13h1v16h-1z M57,14h2v1h-2z M49,15h1v14h-1z M77,15h1v14h-1z M69,16h1v12h-1z M48,18h1v12h-1z M78,18h1v12h-1z M57,22h1v6h-1z M47,24h1v6h-1z M79,24h1v6h-1z M58,26h1v2h-1z M68,26h1v2h-1z M59,27h9v1h-9z"
          />
          <path
            fill="#F29F0F"
            d="M38,24h1v1h-1z M88,24h1v1h-1z M38,35h1v1h-1z M88,35h1v1h-1z M49,11h3v1h-3z M75,11h3v1h-3z M48,12h3v1h-3z M76,12h3v1h-3z M46,13h4v2h-4z M77,13h4v2h-4z M45,14h1v15h-1z M81,14h1v15h-1z M44,15h1v14h-1z M46,15h3v3h-3z M78,15h3v3h-3z M82,15h1v14h-1z M43,16h1v12h-1z M83,16h1v12h-1z M42,17h1v11h-1z M84,17h1v11h-1z M46,18h2v6h-2z M79,18h2v6h-2z M41,19h1v9h-1z M85,19h1v9h-1z M40,20h1v7h-1z M86,20h1v7h-1z M39,22h1v4h-1z M87,22h1v4h-1z M46,24h1v6h-1z M80,24h1v6h-1z M36,29h2v1h-2z M89,29h2v1h-2z M37,30h9v1h-9z M81,30h9v1h-9z M37,31h1v4h-1z M40,31h9v1h-9z M78,31h9v1h-9z M89,31h1v4h-1z M41,32h1v2h-1z M52,32h23v1h-23z M85,32h1v2h-1z M49,33h3v1h-3z M75,33h3v1h-3z M42,34h7v1h-7z M55,34h17v1h-17z M78,34h7v1h-7z M53,35h2v1h-2z M72,35h2v1h-2z M39,36h2v1h-2z M49,36h4v1h-4z M74,36h4v1h-4z M86,36h2v1h-2z M41,37h8v1h-8z M78,37h8v1h-8z"
          />
          <path
            fill="#CE8F37"
            d="M60,11h1v1h-1z M67,11h1v1h-1z M58,15h1v1h-1z M58,19h1v1h-1z M66,22h1v1h-1z M66,26h1v1h-1z M61,12h1v4h-1z M66,12h1v7h-1z M62,13h4v3h-4z M59,14h2v2h-2z M67,14h1v9h-1z M57,16h1v3h-1z M60,16h1v2h-1z M64,16h2v2h-2z M68,16h1v6h-1z M58,17h2v1h-2z M61,17h3v1h-3z M61,18h2v1h-2z M60,19h2v1h-2z M59,22h4v1h-4z M60,23h2v1h-2z M68,24h1v2h-1z M67,25h1v2h-1z"
          />
          <path fill="#7A4C28" d="M60,12h1v2h-1z M67,12h1v2h-1z" />
          <path
            fill="#E0CF8F"
            d="M66,25h1v1h-1z M63,18h3v9h-3z M57,19h1v3h-1z M66,19h1v3h-1z M59,20h1v2h-1z M62,20h1v2h-1z M58,21h1v5h-1z M60,21h2v1h-2z M68,22h1v2h-1z M59,23h1v4h-1z M62,23h1v4h-1z M66,23h2v2h-2z M60,24h2v3h-2z"
          />
          <path
            fill="#DF7D0E"
            d="M38,25h1v4h-1z M88,25h1v4h-1z M39,26h1v3h-1z M87,26h1v3h-1z M40,27h1v2h-1z M86,27h1v2h-1z M41,28h3v1h-3z M83,28h3v1h-3z"
          />
          <path fill="#E8DABC" d="M54,28h19v2h-19z M49,29h5v1h-5z M73,29h5v1h-5z" />
          <path
            fill="#F6B622"
            d="M39,35h1v1h-1z M87,35h1v1h-1z M36,37h1v1h-1z M90,37h1v1h-1z M35,30h2v7h-2z M90,30h2v7h-2z M34,31h1v5h-1z M38,31h2v4h-2z M49,31h29v1h-29z M87,31h2v4h-2z M92,31h1v5h-1z M40,32h1v4h-1z M42,32h10v1h-10z M75,32h10v1h-10z M86,32h1v4h-1z M42,33h7v1h-7z M52,33h23v1h-23z M78,33h7v1h-7z M41,34h1v3h-1z M49,34h6v1h-6z M72,34h6v1h-6z M85,34h1v3h-1z M37,35h1v4h-1z M42,35h11v1h-11z M55,35h17v2h-17z M74,35h11v1h-11z M89,35h1v4h-1z M38,36h1v3h-1z M42,36h7v1h-7z M53,36h2v2h-2z M72,36h2v2h-2z M78,36h7v1h-7z M88,36h1v3h-1z M39,37h2v3h-2z M49,37h4v1h-4z M74,37h4v1h-4z M86,37h2v3h-2z M41,38h9v1h-9z M77,38h9v1h-9z M41,39h7v1h-7z M79,39h7v1h-7z"
          />
        </g>
      );
    case 7: // frog
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M22,8h1v1h-1z M37,8h1v1h-1z M89,8h1v1h-1z M104,8h1v1h-1z M43,13h1v1h-1z M83,13h1v1h-1z M32,18h1v1h-1z M94,18h1v1h-1z M22,23h1v1h-1z M104,23h1v1h-1z M30,27h1v1h-1z M96,27h1v1h-1z M36,38h1v1h-1z M90,38h1v1h-1z M35,39h1v1h-1z M91,39h1v1h-1z M34,40h1v1h-1z M92,40h1v1h-1z M33,41h1v1h-1z M93,41h1v1h-1z M32,42h1v1h-1z M94,42h1v1h-1z M28,51h1v1h-1z M98,51h1v1h-1z M27,5h6v1h-6z M94,5h6v1h-6z M25,6h2v1h-2z M33,6h2v1h-2z M92,6h2v1h-2z M100,6h2v1h-2z M23,7h2v1h-2z M35,7h2v1h-2z M59,7h9v1h-9z M90,7h2v1h-2z M102,7h2v1h-2z M56,8h3v1h-3z M68,8h3v1h-3z M21,9h1v2h-1z M38,9h1v2h-1z M53,9h3v1h-3z M71,9h3v1h-3z M88,9h1v2h-1z M105,9h1v2h-1z M28,10h4v1h-4z M50,10h3v1h-3z M74,10h3v1h-3z M95,10h4v1h-4z M20,11h1v2h-1z M26,11h2v1h-2z M32,11h2v1h-2z M39,11h1v2h-1z M47,11h3v1h-3z M77,11h3v1h-3z M87,11h1v2h-1z M93,11h2v1h-2z M99,11h2v1h-2z M106,11h1v2h-1z M25,12h1v2h-1z M28,12h2v8h-2z M34,12h1v2h-1z M44,12h3v1h-3z M80,12h3v1h-3z M92,12h1v2h-1z M97,12h2v8h-2z M101,12h1v2h-1z M19,13h1v6h-1z M27,13h1v6h-1z M40,13h1v3h-1z M86,13h1v3h-1z M99,13h1v6h-1z M107,13h1v6h-1z M24,14h1v4h-1z M26,14h1v4h-1z M32,14h2v4h-2z M35,14h1v4h-1z M41,14h2v1h-2z M84,14h2v1h-2z M91,14h1v4h-1z M93,14h2v4h-2z M100,14h1v4h-1z M102,14h1v4h-1z M30,15h2v5h-2z M95,15h2v5h-2z M25,18h1v2h-1z M34,18h1v2h-1z M92,18h1v2h-1z M101,18h1v2h-1z M20,19h1v2h-1z M106,19h1v2h-1z M26,20h2v1h-2z M32,20h2v1h-2z M93,20h2v1h-2z M99,20h2v1h-2z M21,21h1v2h-1z M28,21h4v1h-4z M95,21h4v1h-4z M105,21h1v2h-1z M23,24h2v1h-2z M102,24h2v1h-2z M25,25h2v1h-2z M100,25h2v1h-2z M27,26h4v1h-4z M96,26h4v1h-4z M29,28h1v2h-1z M97,28h1v2h-1z M28,30h1v3h-1z M98,30h1v3h-1z M48,32h7v1h-7z M72,32h7v1h-7z M27,33h1v7h-1z M45,33h3v1h-3z M55,33h2v1h-2z M70,33h2v1h-2z M79,33h3v1h-3z M99,33h1v7h-1z M43,34h2v1h-2z M57,34h13v1h-13z M82,34h2v1h-2z M41,35h2v1h-2z M84,35h2v1h-2z M39,36h2v1h-2z M86,36h2v1h-2z M37,37h2v1h-2z M88,37h2v1h-2z M26,40h1v7h-1z M100,40h1v7h-1z M31,43h1v2h-1z M95,43h1v2h-1z M30,45h1v2h-1z M96,45h1v2h-1z M27,47h1v4h-1z M29,47h1v4h-1z M97,47h1v4h-1z M99,47h1v4h-1z"
          />
          <path
            fill="#7FD83C"
            d="M41,31h1v1h-1z M85,31h1v1h-1z M27,6h6v1h-6z M94,6h6v1h-6z M25,7h2v1h-2z M33,7h2v1h-2z M92,7h2v1h-2z M100,7h2v1h-2z M23,8h2v1h-2z M102,8h2v1h-2z M22,9h1v2h-1z M104,9h1v2h-1z M21,11h1v2h-1z M105,11h1v2h-1z M47,12h3v1h-3z M77,12h3v1h-3z M20,13h1v6h-1z M44,13h4v1h-4z M79,13h4v1h-4z M106,13h1v6h-1z M43,14h3v1h-3z M81,14h3v1h-3z M41,15h4v1h-4z M82,15h4v1h-4z M40,16h4v1h-4z M83,16h4v1h-4z M39,17h4v1h-4z M84,17h4v1h-4z M38,18h4v1h-4z M85,18h4v1h-4z M21,19h1v2h-1z M37,19h4v1h-4z M86,19h4v1h-4z M105,19h1v2h-1z M36,20h4v1h-4z M87,20h4v1h-4z M35,21h4v2h-4z M88,21h4v2h-4z M34,22h1v13h-1z M92,22h1v13h-1z M35,23h3v10h-3z M89,23h3v10h-3z M33,24h1v12h-1z M93,24h1v12h-1z M32,25h1v11h-1z M94,25h1v11h-1z M31,26h1v9h-1z M95,26h1v9h-1z M38,27h1v6h-1z M88,27h1v6h-1z M30,28h1v5h-1z M39,28h2v4h-2z M86,28h2v4h-2z M96,28h1v5h-1z M41,29h5v1h-5z M81,29h5v1h-5z M41,30h2v1h-2z M84,30h2v1h-2z M35,33h2v1h-2z M90,33h2v1h-2z"
          />
          <path
            fill="#39BA21"
            d="M27,9h1v1h-1z M32,9h1v1h-1z M94,9h1v1h-1z M99,9h1v1h-1z M25,10h1v1h-1z M101,10h1v1h-1z M26,23h1v1h-1z M100,23h1v1h-1z M32,36h1v1h-1z M94,36h1v1h-1z M27,7h6v2h-6z M94,7h6v2h-6z M25,8h2v2h-2z M33,8h4v2h-4z M90,8h4v2h-4z M100,8h2v2h-2z M23,9h2v3h-2z M37,9h1v5h-1z M56,9h5v20h-5z M66,9h5v20h-5z M89,9h1v5h-1z M102,9h2v3h-2z M34,10h3v1h-3z M53,10h3v19h-3z M61,10h1v20h-1z M65,10h1v20h-1z M71,10h3v19h-3z M90,10h3v1h-3z M22,11h1v12h-1z M35,11h2v1h-2z M38,11h1v4h-1z M50,11h3v18h-3z M62,11h1v18h-1z M64,11h1v18h-1z M74,11h3v18h-3z M88,11h1v4h-1z M90,11h2v1h-2z M104,11h1v12h-1z M23,12h1v2h-1z M36,12h1v2h-1z M90,12h1v2h-1z M103,12h1v2h-1z M21,13h1v6h-1z M39,13h1v2h-1z M48,13h2v16h-2z M77,13h2v16h-2z M87,13h1v2h-1z M105,13h1v6h-1z M46,14h2v15h-2z M79,14h2v15h-2z M45,15h1v14h-1z M81,15h1v14h-1z M44,16h1v13h-1z M82,16h1v13h-1z M43,17h1v12h-1z M83,17h1v12h-1z M23,18h1v6h-1z M42,18h1v11h-1z M84,18h1v11h-1z M103,18h1v6h-1z M41,19h1v10h-1z M85,19h1v10h-1z M24,20h1v4h-1z M40,20h1v8h-1z M86,20h1v8h-1z M102,20h1v4h-1z M25,21h1v3h-1z M39,21h1v7h-1z M87,21h1v7h-1z M101,21h1v3h-1z M26,22h2v1h-2z M99,22h2v1h-2z M38,23h1v4h-1z M88,23h1v4h-1z M57,29h4v1h-4z M66,29h4v1h-4z M29,30h1v8h-1z M46,30h11v1h-11z M70,30h11v1h-11z M97,30h1v8h-1z M43,31h5v1h-5z M55,31h4v1h-4z M68,31h4v1h-4z M79,31h5v1h-5z M42,32h3v1h-3z M57,32h13v1h-13z M82,32h3v1h-3z M28,33h1v4h-1z M30,33h1v6h-1z M39,33h4v1h-4z M84,33h4v1h-4z M96,33h1v6h-1z M98,33h1v4h-1z M37,34h4v1h-4z M86,34h4v1h-4z M31,35h1v4h-1z M35,35h4v1h-4z M88,35h4v1h-4z M95,35h1v4h-1z M34,36h3v1h-3z M90,36h3v1h-3z M33,37h3v1h-3z M91,37h3v1h-3z M33,38h2v1h-2z M92,38h2v1h-2z M32,39h2v1h-2z M93,39h2v1h-2z M31,40h2v1h-2z M94,40h2v1h-2z M30,41h2v1h-2z M95,41h2v1h-2z M29,42h2v1h-2z M96,42h2v1h-2z M29,43h1v2h-1z M97,43h1v2h-1z M28,44h1v3h-1z M98,44h1v3h-1z"
          />
          <path
            fill="#189344"
            d="M25,11h1v1h-1z M34,11h1v1h-1z M92,11h1v1h-1z M101,11h1v1h-1z M38,17h1v1h-1z M88,17h1v1h-1z M36,19h1v1h-1z M90,19h1v1h-1z M25,20h1v1h-1z M101,20h1v1h-1z M32,24h1v1h-1z M94,24h1v1h-1z M42,31h1v1h-1z M84,31h1v1h-1z M34,35h1v1h-1z M92,35h1v1h-1z M33,36h1v1h-1z M93,36h1v1h-1z M36,37h1v1h-1z M90,37h1v1h-1z M35,38h1v1h-1z M91,38h1v1h-1z M34,39h1v1h-1z M92,39h1v1h-1z M30,40h1v1h-1z M33,40h1v1h-1z M93,40h1v1h-1z M96,40h1v1h-1z M32,41h1v1h-1z M94,41h1v1h-1z M31,42h1v1h-1z M95,42h1v1h-1z M59,8h9v1h-9z M28,9h4v1h-4z M61,9h5v1h-5z M95,9h4v1h-4z M26,10h2v1h-2z M32,10h2v1h-2z M62,10h3v1h-3z M93,10h2v1h-2z M99,10h2v1h-2z M63,11h1v21h-1z M24,12h1v2h-1z M35,12h1v2h-1z M91,12h1v2h-1z M102,12h1v2h-1z M23,14h1v4h-1z M36,14h2v5h-2z M89,14h2v5h-2z M103,14h1v4h-1z M38,15h2v2h-2z M87,15h2v2h-2z M24,18h1v2h-1z M35,18h1v3h-1z M91,18h1v3h-1z M102,18h1v2h-1z M34,20h1v2h-1z M92,20h1v2h-1z M26,21h2v1h-2z M32,21h2v3h-2z M93,21h2v3h-2z M99,21h2v1h-2z M28,22h4v4h-4z M95,22h4v4h-4z M27,23h1v3h-1z M99,23h1v3h-1z M25,24h2v1h-2z M100,24h2v1h-2z M46,29h11v1h-11z M62,29h1v3h-1z M64,29h1v3h-1z M70,29h11v1h-11z M43,30h3v1h-3z M57,30h5v1h-5z M65,30h5v1h-5z M81,30h3v1h-3z M48,31h7v1h-7z M59,31h3v1h-3z M65,31h3v1h-3z M72,31h7v1h-7z M39,32h3v1h-3z M45,32h3v1h-3z M55,32h2v1h-2z M70,32h2v1h-2z M79,32h3v1h-3z M85,32h3v1h-3z M37,33h2v1h-2z M43,33h2v1h-2z M57,33h13v1h-13z M82,33h2v1h-2z M88,33h2v1h-2z M35,34h2v1h-2z M41,34h2v1h-2z M84,34h2v1h-2z M90,34h2v1h-2z M39,35h2v1h-2z M86,35h2v1h-2z M37,36h2v1h-2z M88,36h2v1h-2z M28,37h1v7h-1z M32,37h1v2h-1z M94,37h1v2h-1z M98,37h1v7h-1z M29,38h1v4h-1z M97,38h1v4h-1z M30,39h2v1h-2z M95,39h2v1h-2z M27,40h1v7h-1z M99,40h1v7h-1z M30,43h1v2h-1z M96,43h1v2h-1z M29,45h1v2h-1z M97,45h1v2h-1z M28,47h1v4h-1z M98,47h1v4h-1z"
          />
          <path
            fill="#E9F1F6"
            d="M26,13h1v1h-1z M100,13h1v1h-1z M27,19h1v1h-1z M32,19h1v1h-1z M94,19h1v1h-1z M99,19h1v1h-1z M28,11h4v1h-4z M95,11h4v1h-4z M26,12h2v1h-2z M30,12h4v2h-4z M93,12h4v2h-4z M99,12h2v1h-2z M25,14h1v4h-1z M30,14h2v1h-2z M34,14h1v4h-1z M92,14h1v4h-1z M95,14h2v1h-2z M101,14h1v4h-1z M26,18h1v2h-1z M33,18h1v2h-1z M93,18h1v2h-1z M100,18h1v2h-1z M28,20h4v1h-4z M95,20h4v1h-4z"
          />
        </g>
      );
    case 8: // miner
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M60,9h1v1h-1z M66,9h1v1h-1z M49,10h1v1h-1z M77,10h1v1h-1z M48,11h1v1h-1z M55,11h1v1h-1z M71,11h1v1h-1z M78,11h1v1h-1z M42,16h1v1h-1z M84,16h1v1h-1z M41,17h1v1h-1z M85,17h1v1h-1z M40,18h1v1h-1z M86,18h1v1h-1z M58,21h1v1h-1z M68,21h1v1h-1z M57,22h1v1h-1z M69,22h1v1h-1z M60,23h1v1h-1z M66,23h1v1h-1z M59,24h1v1h-1z M67,24h1v1h-1z M59,30h1v1h-1z M67,30h1v1h-1z M35,31h1v1h-1z M60,31h1v1h-1z M66,31h1v1h-1z M91,31h1v1h-1z M34,32h1v1h-1z M57,32h1v1h-1z M69,32h1v1h-1z M92,32h1v1h-1z M33,33h1v1h-1z M58,33h1v1h-1z M68,33h1v1h-1z M93,33h1v1h-1z M32,34h1v1h-1z M94,34h1v1h-1z M31,35h1v1h-1z M95,35h1v1h-1z M30,36h1v1h-1z M96,36h1v1h-1z M61,8h5v1h-5z M50,9h4v1h-4z M73,9h4v1h-4z M54,10h1v2h-1z M56,10h4v1h-4z M67,10h4v1h-4z M72,10h1v2h-1z M59,11h1v3h-1z M67,11h1v3h-1z M47,12h1v2h-1z M79,12h1v2h-1z M45,14h2v1h-2z M80,14h2v1h-2z M43,15h2v1h-2z M46,15h1v4h-1z M80,15h1v4h-1z M82,15h2v1h-2z M39,19h1v2h-1z M61,19h5v1h-5z M87,19h1v2h-1z M59,20h2v1h-2z M66,20h2v1h-2z M38,21h1v2h-1z M88,21h1v2h-1z M61,22h5v1h-5z M37,23h1v3h-1z M56,23h1v2h-1z M70,23h1v2h-1z M89,23h1v3h-1z M36,25h1v6h-1z M38,25h18v1h-18z M58,25h1v5h-1z M68,25h1v5h-1z M71,25h18v1h-18z M90,25h1v6h-1z M51,26h5v5h-5z M71,26h5v5h-5z M50,28h1v3h-1z M76,28h1v3h-1z M37,30h13v1h-13z M56,30h1v2h-1z M70,30h1v2h-1z M77,30h13v1h-13z M61,32h5v1h-5z M59,34h2v1h-2z M66,34h2v1h-2z M61,35h5v1h-5z M29,37h1v2h-1z M97,37h1v2h-1z M30,39h2v1h-2z M95,39h2v1h-2z M32,40h7v1h-7z M88,40h7v1h-7z M39,41h13v1h-13z M75,41h13v1h-13z M52,42h23v1h-23z"
          />
          <path
            fill="#FFE760"
            d="M61,9h1v1h-1z M65,9h1v1h-1z M43,19h1v1h-1z M46,19h1v1h-1z M80,19h1v1h-1z M83,19h1v1h-1z M45,20h1v1h-1z M81,20h1v1h-1z M50,10h2v1h-2z M75,10h2v1h-2z M49,11h2v1h-2z M76,11h2v1h-2z M48,12h2v2h-2z M61,12h1v3h-1z M65,12h1v3h-1z M77,12h2v2h-2z M47,14h2v3h-2z M62,14h3v2h-3z M78,14h2v3h-2z M45,15h1v3h-1z M81,15h1v3h-1z M43,16h2v3h-2z M82,16h2v3h-2z M42,17h1v4h-1z M84,17h1v4h-1z M41,18h1v4h-1z M85,18h1v4h-1z M40,19h1v6h-1z M86,19h1v6h-1z M39,21h1v4h-1z M44,21h1v4h-1z M82,21h1v4h-1z M87,21h1v4h-1z M38,23h1v2h-1z M43,23h1v2h-1z M83,23h1v2h-1z M88,23h1v2h-1z M35,32h3v1h-3z M89,32h3v1h-3z M38,33h5v1h-5z M84,33h5v1h-5z M43,34h11v1h-11z M73,34h11v1h-11z M54,35h7v1h-7z M66,35h7v1h-7z M30,37h2v2h-2z M95,37h2v2h-2z M32,38h7v2h-7z M88,38h7v2h-7z M39,39h13v2h-13z M75,39h13v2h-13z M52,40h23v2h-23z"
          />
          <path
            fill="#FEBD01"
            d="M61,15h1v1h-1z M65,15h1v1h-1z M31,36h1v1h-1z M95,36h1v1h-1z M62,9h3v5h-3z M52,10h2v1h-2z M61,10h1v2h-1z M65,10h1v2h-1z M73,10h2v1h-2z M51,11h2v1h-2z M56,11h3v8h-3z M68,11h3v8h-3z M74,11h2v1h-2z M50,12h2v2h-2z M54,12h2v8h-2z M71,12h2v8h-2z M75,12h2v2h-2z M49,14h2v1h-2z M53,14h1v7h-1z M73,14h1v7h-1z M76,14h2v1h-2z M49,15h1v2h-1z M52,15h1v7h-1z M59,15h1v4h-1z M67,15h1v4h-1z M74,15h1v7h-1z M77,15h1v2h-1z M62,16h3v1h-3z M47,17h2v1h-2z M60,17h1v2h-1z M66,17h1v2h-1z M78,17h2v1h-2z M45,18h1v2h-1z M51,18h1v6h-1z M61,18h5v1h-5z M75,18h1v6h-1z M81,18h1v2h-1z M44,19h1v2h-1z M50,19h1v6h-1z M76,19h1v6h-1z M82,19h1v2h-1z M43,20h1v3h-1z M46,20h4v5h-4z M77,20h4v5h-4z M83,20h1v3h-1z M42,21h1v4h-1z M45,21h1v4h-1z M81,21h1v4h-1z M84,21h1v4h-1z M41,22h1v3h-1z M85,22h1v3h-1z M34,33h4v5h-4z M89,33h4v5h-4z M33,34h1v4h-1z M38,34h5v4h-5z M84,34h5v4h-5z M93,34h1v4h-1z M32,35h1v3h-1z M43,35h11v4h-11z M73,35h11v4h-11z M94,35h1v3h-1z M54,36h19v4h-19z M39,38h4v1h-4z M84,38h4v1h-4z M52,39h2v1h-2z M73,39h2v1h-2z"
          />
          <path
            fill="#E09511"
            d="M59,14h1v1h-1z M67,14h1v1h-1z M51,24h1v1h-1z M75,24h1v1h-1z M60,10h1v7h-1z M66,10h1v7h-1z M53,11h1v3h-1z M73,11h1v3h-1z M52,12h1v3h-1z M74,12h1v3h-1z M51,14h1v4h-1z M75,14h1v4h-1z M50,15h1v4h-1z M76,15h1v4h-1z M61,16h1v2h-1z M65,16h1v2h-1z M49,17h1v3h-1z M62,17h3v1h-3z M77,17h1v3h-1z M47,18h2v2h-2z M78,18h2v2h-2z M56,19h5v1h-5z M66,19h5v1h-5z M54,20h5v1h-5z M68,20h5v1h-5z M53,21h5v1h-5z M69,21h5v1h-5z M52,22h5v1h-5z M70,22h5v1h-5z M52,23h4v2h-4z M71,23h4v2h-4z M36,31h20v1h-20z M71,31h20v1h-20z M38,32h19v1h-19z M70,32h19v1h-19z M43,33h15v1h-15z M69,33h15v1h-15z M54,34h5v1h-5z M68,34h5v1h-5z"
          />
          <path
            fill="#E7EBEE"
            d="M58,22h1v1h-1z M68,22h1v1h-1z M59,29h1v1h-1z M67,29h1v1h-1z M58,32h1v1h-1z M68,32h1v1h-1z M61,20h5v1h-5z M59,21h2v1h-2z M66,21h2v1h-2z M57,23h1v2h-1z M61,23h5v1h-5z M69,23h1v2h-1z M60,24h2v1h-2z M63,24h1v4h-1z M65,24h2v1h-2z M56,25h1v5h-1z M59,25h1v3h-1z M61,25h1v3h-1z M65,25h1v3h-1z M67,25h1v3h-1z M70,25h1v5h-1z M57,30h1v2h-1z M60,30h2v1h-2z M63,30h1v2h-1z M65,30h2v1h-2z M69,30h1v2h-1z M61,31h2v1h-2z M64,31h2v1h-2z"
          />
          <path
            fill="#28292A"
            d="M58,24h1v1h-1z M68,24h1v1h-1z M61,21h5v1h-5z M59,22h2v1h-2z M66,22h2v1h-2z M58,23h2v1h-2z M67,23h2v1h-2z M57,25h1v5h-1z M69,25h1v5h-1z M58,30h1v2h-1z M68,30h1v2h-1z M59,31h1v3h-1z M67,31h1v3h-1z M60,32h1v2h-1z M66,32h1v2h-1z M61,33h5v2h-5z"
          />
          <path
            fill="#F9FCFE"
            d="M62,24h1v7h-1z M64,24h1v7h-1z M60,25h1v5h-1z M66,25h1v5h-1z"
          />
          <path
            fill="#9A9A9A"
            d="M37,26h9v2h-9z M81,26h9v2h-9z M37,28h8v2h-8z M82,28h8v2h-8z"
          />
          <path
            fill="#7A7A7A"
            d="M46,26h5v2h-5z M76,26h5v2h-5z M45,28h5v2h-5z M77,28h5v2h-5z"
          />
          <path
            fill="#B3B9C0"
            d="M59,28h1v1h-1z M67,28h1v1h-1z M61,28h1v2h-1z M63,28h1v2h-1z M65,28h1v2h-1z"
          />
        </g>
      );
    case 9: // one piece
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M47,9h1v1h-1z M79,9h1v1h-1z M46,10h1v1h-1z M80,10h1v1h-1z M45,11h1v1h-1z M81,11h1v1h-1z M44,12h1v1h-1z M82,12h1v1h-1z M43,13h1v1h-1z M83,13h1v1h-1z M38,30h1v1h-1z M88,30h1v1h-1z M25,36h1v1h-1z M101,36h1v1h-1z M57,4h13v1h-13z M54,5h3v1h-3z M70,5h3v1h-3z M52,6h2v1h-2z M73,6h2v1h-2z M50,7h2v1h-2z M75,7h2v1h-2z M48,8h2v1h-2z M77,8h2v1h-2z M42,14h1v2h-1z M84,14h1v2h-1z M41,16h1v3h-1z M85,16h1v3h-1z M40,19h1v5h-1z M55,19h17v1h-17z M86,19h1v5h-1z M50,20h5v1h-5z M72,20h5v1h-5z M45,21h5v1h-5z M77,21h5v1h-5z M41,22h4v1h-4z M82,22h4v1h-4z M39,24h1v7h-1z M87,24h1v7h-1z M44,29h11v1h-11z M72,29h11v1h-11z M40,30h4v1h-4z M55,30h6v1h-6z M66,30h6v1h-6z M83,30h4v1h-4z M35,31h3v1h-3z M61,31h5v1h-5z M89,31h3v1h-3z M33,32h2v1h-2z M92,32h2v1h-2z M31,33h2v1h-2z M94,33h2v1h-2z M28,34h3v1h-3z M96,34h3v1h-3z M26,35h2v1h-2z M99,35h2v1h-2z M38,36h17v1h-17z M72,36h17v1h-17z M23,37h2v1h-2z M32,37h6v1h-6z M55,37h5v1h-5z M67,37h5v1h-5z M89,37h6v1h-6z M102,37h2v1h-2z M22,38h1v2h-1z M28,38h4v1h-4z M60,38h7v1h-7z M95,38h4v1h-4z M104,38h1v2h-1z M25,39h3v1h-3z M99,39h3v1h-3z M23,40h2v1h-2z M102,40h2v1h-2z"
          />
          <path
            fill="#D7A743"
            d="M57,7h1v1h-1z M69,7h1v1h-1z M46,13h1v1h-1z M80,13h1v1h-1z M48,16h1v1h-1z M78,16h1v1h-1z M59,18h1v1h-1z M67,18h1v1h-1z M52,19h1v1h-1z M74,19h1v1h-1z M48,20h1v1h-1z M78,20h1v1h-1z M57,5h13v2h-13z M54,6h3v7h-3z M70,6h3v7h-3z M52,7h2v1h-2z M59,7h9v8h-9z M73,7h2v1h-2z M50,8h3v1h-3z M58,8h1v11h-1z M68,8h1v11h-1z M74,8h3v1h-3z M48,9h4v1h-4z M53,9h1v2h-1z M73,9h1v2h-1z M75,9h4v1h-4z M47,10h4v1h-4z M52,10h1v2h-1z M74,10h1v2h-1z M76,10h4v1h-4z M46,11h4v2h-4z M51,11h1v3h-1z M57,11h1v8h-1z M69,11h1v8h-1z M75,11h1v3h-1z M77,11h4v2h-4z M45,12h1v5h-1z M50,12h1v8h-1z M53,12h1v8h-1z M73,12h1v8h-1z M76,12h1v8h-1z M81,12h1v5h-1z M44,13h1v5h-1z M48,13h1v2h-1z M54,13h1v7h-1z M56,13h1v6h-1z M70,13h1v6h-1z M72,13h1v7h-1z M78,13h1v2h-1z M82,13h1v5h-1z M43,14h1v3h-1z M47,14h1v6h-1z M79,14h1v6h-1z M83,14h1v3h-1z M49,15h1v6h-1z M52,15h1v2h-1z M59,15h3v1h-3z M63,15h1v4h-1z M65,15h3v1h-3z M74,15h1v2h-1z M77,15h1v6h-1z M46,16h1v4h-1z M51,16h1v4h-1z M55,16h1v3h-1z M60,16h2v3h-2z M65,16h2v3h-2z M71,16h1v3h-1z M75,16h1v4h-1z M80,16h1v4h-1z M62,17h1v2h-1z M64,17h1v2h-1z M44,30h4v1h-4z M51,30h4v1h-4z M72,30h4v1h-4z M79,30h4v1h-4z M38,31h6v1h-6z M47,31h6v1h-6z M56,31h5v2h-5z M66,31h5v2h-5z M74,31h6v1h-6z M83,31h6v1h-6z M35,32h4v1h-4z M42,32h7v1h-7z M52,32h4v1h-4z M61,32h5v3h-5z M71,32h4v1h-4z M78,32h7v1h-7z M88,32h4v1h-4z M36,33h8v1h-8z M55,33h3v1h-3z M69,33h3v1h-3z M83,33h8v1h-8z M31,34h5v1h-5z M91,34h5v1h-5z M28,35h3v1h-3z M96,35h3v1h-3z M26,36h2v1h-2z M99,36h2v1h-2z"
          />
          <path
            fill="#7C5923"
            d="M58,7h1v1h-1z M68,7h1v1h-1z M53,8h1v1h-1z M73,8h1v1h-1z M52,9h1v1h-1z M74,9h1v1h-1z M51,10h1v1h-1z M75,10h1v1h-1z M50,11h1v1h-1z M53,11h1v1h-1z M73,11h1v1h-1z M76,11h1v1h-1z M47,13h1v1h-1z M79,13h1v1h-1z M48,15h1v1h-1z M78,15h1v1h-1z M43,20h1v1h-1z M83,20h1v1h-1z M52,33h1v1h-1z M74,33h1v1h-1z M38,34h1v1h-1z M88,34h1v1h-1z M57,8h1v3h-1z M69,8h1v3h-1z M52,12h1v3h-1z M74,12h1v3h-1z M49,13h1v2h-1z M55,13h1v3h-1z M71,13h1v3h-1z M77,13h1v2h-1z M46,14h1v2h-1z M51,14h1v2h-1z M75,14h1v2h-1z M80,14h1v2h-1z M62,15h1v2h-1z M64,15h1v2h-1z M59,16h1v2h-1z M67,16h1v2h-1z M45,17h1v2h-1z M48,17h1v3h-1z M52,17h1v2h-1z M74,17h1v2h-1z M78,17h1v3h-1z M81,17h1v2h-1z M48,30h3v1h-3z M76,30h3v1h-3z M44,31h3v1h-3z M53,31h3v1h-3z M71,31h3v1h-3z M80,31h3v1h-3z M39,32h3v1h-3z M49,32h3v1h-3z M75,32h3v1h-3z M85,32h3v1h-3z M33,33h3v1h-3z M47,33h1v2h-1z M58,33h3v1h-3z M66,33h3v1h-3z M79,33h1v2h-1z M91,33h3v1h-3z M42,34h1v2h-1z M57,34h1v2h-1z M69,34h1v2h-1z M84,34h1v2h-1z M31,35h1v2h-1z M34,35h1v2h-1z M59,35h1v2h-1z M63,35h1v2h-1z M67,35h1v2h-1z M92,35h1v2h-1z M95,35h1v2h-1z M27,37h1v2h-1z M99,37h1v2h-1z"
          />
          <path
            fill="#B4722E"
            d="M43,21h1v1h-1z M83,21h1v1h-1z M38,35h1v1h-1z M47,35h1v1h-1z M79,35h1v1h-1z M88,35h1v1h-1z M57,36h1v1h-1z M69,36h1v1h-1z M31,37h1v1h-1z M63,37h1v1h-1z M95,37h1v1h-1z M42,16h1v6h-1z M84,16h1v6h-1z M43,17h1v3h-1z M83,17h1v3h-1z M44,18h1v4h-1z M82,18h1v4h-1z M41,19h1v3h-1z M45,19h1v2h-1z M81,19h1v2h-1z M85,19h1v3h-1z M46,20h2v1h-2z M79,20h2v1h-2z M44,33h3v3h-3z M48,33h4v3h-4z M53,33h2v3h-2z M72,33h2v3h-2z M75,33h4v3h-4z M80,33h3v3h-3z M36,34h2v3h-2z M39,34h3v2h-3z M43,34h1v2h-1z M52,34h1v2h-1z M55,34h2v3h-2z M58,34h3v1h-3z M66,34h3v1h-3z M70,34h2v3h-2z M74,34h1v2h-1z M83,34h1v2h-1z M85,34h3v2h-3z M89,34h2v3h-2z M32,35h2v2h-2z M35,35h1v2h-1z M58,35h1v2h-1z M60,35h3v3h-3z M64,35h3v3h-3z M68,35h1v2h-1z M91,35h1v2h-1z M93,35h2v2h-2z M28,36h3v2h-3z M96,36h3v2h-3z M25,37h2v2h-2z M100,37h2v2h-2z M23,38h2v2h-2z M102,38h2v2h-2z"
          />
          <path
            fill="#C33132"
            d="M64,27h1v1h-1z M54,28h1v1h-1z M55,20h17v5h-17z M50,21h5v3h-5z M72,21h5v5h-5z M45,22h5v1h-5z M77,22h5v3h-5z M48,23h2v1h-2z M82,23h1v2h-1z M52,24h3v1h-3z M83,24h2v1h-2z M64,25h8v2h-8z M77,25h3v1h-3z M46,26h8v3h-8z M62,26h2v2h-2z M72,26h3v1h-3z M43,27h3v1h-3z M54,27h8v1h-8z M44,28h2v1h-2z M55,29h17v1h-17z M61,30h5v1h-5z"
          />
          <path
            fill="#85102B"
            d="M41,23h7v3h-7z M83,23h3v1h-3z M40,24h1v6h-1z M48,24h4v2h-4z M85,24h2v6h-2z M52,25h12v1h-12z M80,25h5v4h-5z M41,26h5v1h-5z M54,26h8v1h-8z M75,26h5v3h-5z M41,27h2v3h-2z M65,27h10v2h-10z M43,28h1v2h-1z M55,28h10v1h-10z M83,29h2v1h-2z"
          />
        </g>
      );
    case 10: // orca
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M61,10h1v1h-1z M65,10h1v1h-1z M60,11h1v1h-1z M66,11h1v1h-1z M45,20h1v1h-1z M81,20h1v1h-1z M42,22h1v1h-1z M84,22h1v1h-1z M41,23h1v1h-1z M85,23h1v1h-1z M40,24h1v1h-1z M86,24h1v1h-1z M39,25h1v1h-1z M87,25h1v1h-1z M38,26h1v1h-1z M88,26h1v1h-1z M37,27h1v1h-1z M89,27h1v1h-1z M36,28h1v1h-1z M90,28h1v1h-1z M35,29h1v1h-1z M91,29h1v1h-1z M34,30h1v1h-1z M92,30h1v1h-1z M63,31h1v1h-1z M61,34h1v1h-1z M65,34h1v1h-1z M31,35h1v1h-1z M45,35h1v1h-1z M51,35h1v1h-1z M75,35h1v1h-1z M81,35h1v1h-1z M95,35h1v1h-1z M52,36h1v1h-1z M74,36h1v1h-1z M42,37h1v1h-1z M59,37h1v1h-1z M67,37h1v1h-1z M84,37h1v1h-1z M41,38h1v1h-1z M55,38h1v1h-1z M71,38h1v1h-1z M85,38h1v1h-1z M56,39h1v1h-1z M70,39h1v1h-1z M39,40h1v1h-1z M41,40h1v1h-1z M57,40h1v1h-1z M69,40h1v1h-1z M85,40h1v1h-1z M87,40h1v1h-1z M27,42h1v1h-1z M99,42h1v1h-1z M26,43h1v1h-1z M37,43h1v1h-1z M46,43h1v1h-1z M80,43h1v1h-1z M89,43h1v1h-1z M100,43h1v1h-1z M25,44h1v1h-1z M101,44h1v1h-1z M38,46h1v1h-1z M88,46h1v1h-1z M20,50h1v1h-1z M106,50h1v1h-1z M21,51h1v1h-1z M105,51h1v1h-1z M30,66h1v1h-1z M96,66h1v1h-1z M62,9h3v1h-3z M59,12h1v2h-1z M67,12h1v2h-1z M58,14h1v2h-1z M68,14h1v2h-1z M54,16h4v1h-4z M69,16h4v1h-4z M50,17h4v1h-4z M73,17h4v1h-4z M48,18h2v1h-2z M77,18h2v1h-2z M46,19h2v1h-2z M79,19h2v1h-2z M43,21h2v1h-2z M82,21h2v1h-2z M58,30h11v1h-11z M33,31h1v2h-1z M54,31h4v1h-4z M69,31h4v1h-4z M93,31h1v2h-1z M51,32h3v1h-3z M62,32h1v2h-1z M64,32h1v2h-1z M73,32h3v1h-3z M32,33h1v2h-1z M49,33h2v1h-2z M76,33h2v1h-2z M94,33h1v2h-1z M46,34h3v1h-3z M50,34h1v2h-1z M76,34h1v2h-1z M78,34h3v1h-3z M60,35h1v2h-1z M66,35h1v2h-1z M30,36h1v3h-1z M43,36h2v1h-2z M49,36h1v3h-1z M77,36h1v3h-1z M82,36h2v1h-2z M96,36h1v3h-1z M53,37h2v1h-2z M72,37h2v1h-2z M58,38h1v2h-1z M68,38h1v2h-1z M29,39h1v2h-1z M40,39h1v5h-1z M48,39h1v3h-1z M78,39h1v3h-1z M86,39h1v5h-1z M97,39h1v2h-1z M28,41h1v4h-1z M38,41h1v2h-1z M42,41h2v1h-2z M83,41h2v1h-2z M88,41h1v2h-1z M98,41h1v4h-1z M44,42h2v1h-2z M47,42h1v2h-1z M79,42h1v2h-1z M81,42h2v1h-2z M36,44h1v2h-1z M39,44h1v3h-1z M87,44h1v3h-1z M90,44h1v2h-1z M23,45h2v1h-2z M27,45h1v10h-1z M99,45h1v10h-1z M102,45h2v1h-2z M20,46h3v1h-3z M35,46h1v2h-1z M91,46h1v2h-1z M104,46h3v1h-3z M19,47h1v3h-1z M36,47h2v1h-2z M89,47h2v1h-2z M107,47h1v3h-1z M34,48h1v2h-1z M92,48h1v2h-1z M33,50h1v6h-1z M93,50h1v6h-1z M22,52h2v1h-2z M103,52h2v1h-2z M24,53h3v1h-3z M100,53h3v1h-3z M28,55h1v6h-1z M98,55h1v6h-1z M32,56h1v4h-1z M94,56h1v4h-1z M31,60h1v6h-1z M95,60h1v6h-1z M29,61h1v5h-1z M97,61h1v5h-1z"
          />
          <path
            fill="#3C4F52"
            d="M58,16h1v1h-1z M68,16h1v1h-1z M42,23h1v1h-1z M84,23h1v1h-1z M62,10h3v2h-3z M61,11h1v2h-1z M65,11h1v2h-1z M60,12h1v3h-1z M66,12h1v3h-1z M59,14h1v3h-1z M67,14h1v3h-1z M54,17h4v1h-4z M69,17h4v1h-4z M50,18h4v1h-4z M73,18h4v1h-4z M48,19h4v1h-4z M75,19h4v1h-4z M46,20h4v1h-4z M77,20h4v1h-4z M45,21h4v1h-4z M78,21h4v1h-4z M43,22h5v1h-5z M79,22h5v1h-5z M35,30h1v3h-1z M91,30h1v3h-1z M34,31h1v6h-1z M92,31h1v6h-1z M33,33h1v5h-1z M93,33h1v5h-1z M32,35h1v5h-1z M94,35h1v5h-1z M31,36h1v6h-1z M95,36h1v6h-1z M30,39h1v6h-1z M96,39h1v6h-1z M29,41h1v9h-1z M97,41h1v9h-1z M27,43h1v2h-1z M99,43h1v2h-1z M26,44h1v4h-1z M100,44h1v4h-1z M25,45h1v4h-1z M28,45h1v7h-1z M98,45h1v7h-1z M101,45h1v4h-1z M23,46h2v4h-2z M102,46h2v4h-2z M20,47h3v3h-3z M104,47h3v3h-3z"
          />
          <path
            fill="#1A252B"
            d="M47,23h1v1h-1z M79,23h1v1h-1z M36,29h1v1h-1z M90,29h1v1h-1z M50,32h1v1h-1z M76,32h1v1h-1z M24,52h1v1h-1z M102,52h1v1h-1z M62,12h3v18h-3z M61,13h1v17h-1z M65,13h1v17h-1z M60,15h1v15h-1z M66,15h1v15h-1z M58,17h2v13h-2z M67,17h2v13h-2z M54,18h4v13h-4z M69,18h4v13h-4z M52,19h2v13h-2z M73,19h2v13h-2z M50,20h2v12h-2z M75,20h2v12h-2z M49,21h1v12h-1z M77,21h1v12h-1z M48,22h1v3h-1z M78,22h1v3h-1z M48,29h1v5h-1z M78,29h1v5h-1z M47,31h1v3h-1z M79,31h1v3h-1z M46,32h1v2h-1z M80,32h1v2h-1z M45,33h1v2h-1z M81,33h1v2h-1z M44,34h1v2h-1z M82,34h1v2h-1z M42,35h2v1h-2z M83,35h2v1h-2z M39,36h4v1h-4z M84,36h4v1h-4z M34,37h1v11h-1z M37,37h5v1h-5z M85,37h5v1h-5z M92,37h1v11h-1z M33,38h1v12h-1z M35,38h6v1h-6z M86,38h6v1h-6z M93,38h1v12h-1z M35,39h5v1h-5z M87,39h5v1h-5z M32,40h1v16h-1z M35,40h4v1h-4z M88,40h4v1h-4z M94,40h1v16h-1z M35,41h3v2h-3z M89,41h3v2h-3z M31,42h1v18h-1z M95,42h1v18h-1z M35,43h2v1h-2z M90,43h2v1h-2z M35,44h1v2h-1z M91,44h1v2h-1z M30,45h1v21h-1z M96,45h1v21h-1z M26,48h1v5h-1z M100,48h1v5h-1z M25,49h1v4h-1z M101,49h1v4h-1z M21,50h4v1h-4z M29,50h1v11h-1z M97,50h1v11h-1z M102,50h4v1h-4z M22,51h3v1h-3z M102,51h3v1h-3z M28,52h1v3h-1z M98,52h1v3h-1z"
          />
          <path
            fill="#E9F1F6"
            d="M43,31h1v1h-1z M83,31h1v1h-1z M41,33h1v1h-1z M85,33h1v1h-1z M57,39h1v1h-1z M69,39h1v1h-1z M43,40h1v1h-1z M83,40h1v1h-1z M46,42h1v1h-1z M80,42h1v1h-1z M39,43h1v1h-1z M87,43h1v1h-1z M37,46h1v1h-1z M89,46h1v1h-1z M43,23h4v5h-4z M80,23h4v5h-4z M41,24h2v9h-2z M47,24h1v2h-1z M79,24h1v2h-1z M84,24h2v9h-2z M40,25h1v9h-1z M86,25h1v9h-1z M39,26h1v9h-1z M87,26h1v9h-1z M38,27h1v8h-1z M88,27h1v8h-1z M37,28h1v7h-1z M43,28h3v2h-3z M81,28h3v2h-3z M89,28h1v7h-1z M36,30h1v6h-1z M43,30h2v1h-2z M82,30h2v1h-2z M90,30h1v6h-1z M35,33h1v3h-1z M58,33h4v1h-4z M65,33h4v1h-4z M91,33h1v3h-1z M54,34h7v1h-7z M66,34h7v1h-7z M52,35h8v1h-8z M67,35h8v1h-8z M53,36h7v1h-7z M67,36h7v1h-7z M47,37h2v2h-2z M55,37h4v1h-4z M68,37h4v1h-4z M78,37h2v2h-2z M45,38h2v4h-2z M56,38h2v1h-2z M69,38h2v1h-2z M80,38h2v4h-2z M44,39h1v3h-1z M47,39h1v3h-1z M79,39h1v3h-1z M82,39h1v3h-1z M38,44h1v2h-1z M88,44h1v2h-1z"
          />
          <path
            fill="#BED2E9"
            d="M46,37h1v1h-1z M80,37h1v1h-1z M41,39h1v1h-1z M43,39h1v1h-1z M83,39h1v1h-1z M85,39h1v1h-1z M38,43h1v1h-1z M88,43h1v1h-1z M36,46h1v1h-1z M90,46h1v1h-1z M48,25h1v4h-1z M78,25h1v4h-1z M47,26h1v5h-1z M79,26h1v5h-1z M46,28h1v4h-1z M80,28h1v4h-1z M45,30h1v3h-1z M81,30h1v3h-1z M44,31h1v3h-1z M58,31h5v1h-5z M64,31h5v1h-5z M82,31h1v3h-1z M43,32h1v3h-1z M54,32h8v1h-8z M65,32h8v1h-8z M83,32h1v3h-1z M42,33h1v2h-1z M51,33h7v1h-7z M69,33h7v1h-7z M84,33h1v2h-1z M40,34h2v2h-2z M49,34h1v2h-1z M51,34h3v1h-3z M73,34h3v1h-3z M77,34h1v2h-1z M85,34h2v2h-2z M37,35h3v1h-3z M46,35h3v2h-3z M78,35h3v2h-3z M87,35h3v1h-3z M35,36h4v1h-4z M45,36h1v2h-1z M81,36h1v2h-1z M88,36h4v1h-4z M35,37h2v1h-2z M43,37h2v2h-2z M82,37h2v2h-2z M90,37h2v1h-2z M42,38h1v3h-1z M84,38h1v3h-1z M39,41h1v2h-1z M87,41h1v2h-1z M37,44h1v2h-1z M89,44h1v2h-1z"
          />
        </g>
      );
    case 11: // panda
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M44,6h1v1h-1z M52,6h1v1h-1z M74,6h1v1h-1z M82,6h1v1h-1z M50,9h1v1h-1z M76,9h1v1h-1z M49,10h1v1h-1z M77,10h1v1h-1z M48,11h1v1h-1z M78,11h1v1h-1z M47,12h1v1h-1z M79,12h1v1h-1z M46,14h1v1h-1z M80,14h1v1h-1z M42,23h1v1h-1z M84,23h1v1h-1z M41,24h1v1h-1z M85,24h1v1h-1z M40,25h1v1h-1z M86,25h1v1h-1z M39,26h1v1h-1z M87,26h1v1h-1z M38,27h1v1h-1z M88,27h1v1h-1z M37,28h1v1h-1z M89,28h1v1h-1z M36,29h1v1h-1z M90,29h1v1h-1z M35,30h1v1h-1z M91,30h1v1h-1z M34,31h1v1h-1z M92,31h1v1h-1z M33,32h1v1h-1z M93,32h1v1h-1z M47,4h3v1h-3z M77,4h3v1h-3z M45,5h2v1h-2z M50,5h2v1h-2z M60,5h7v1h-7z M75,5h2v1h-2z M80,5h2v1h-2z M56,6h4v1h-4z M67,6h4v1h-4z M43,7h1v4h-1z M53,7h3v1h-3z M71,7h3v1h-3z M83,7h1v4h-1z M51,8h2v1h-2z M74,8h2v1h-2z M44,11h1v2h-1z M82,11h1v2h-1z M45,13h2v1h-2z M80,13h2v1h-2z M45,15h1v2h-1z M81,15h1v2h-1z M44,17h1v4h-1z M82,17h1v4h-1z M62,18h3v3h-3z M61,19h1v2h-1z M65,19h1v2h-1z M43,21h1v3h-1z M63,21h1v2h-1z M83,21h1v3h-1z M61,23h2v1h-2z M64,23h2v1h-2z M44,24h3v1h-3z M80,24h3v1h-3z M47,25h3v1h-3z M77,25h3v1h-3z M50,26h6v1h-6z M71,26h6v1h-6z M56,27h15v1h-15z M34,33h2v1h-2z M91,33h2v1h-2z M36,34h3v1h-3z M88,34h3v1h-3z M39,35h3v1h-3z M60,35h7v1h-7z M85,35h3v1h-3z M42,36h5v1h-5z M55,36h5v1h-5z M67,36h5v1h-5z M80,36h5v1h-5z M47,37h8v1h-8z M72,37h8v1h-8z"
          />
          <path
            fill="#212122"
            d="M52,7h1v1h-1z M74,7h1v1h-1z M50,8h1v1h-1z M76,8h1v1h-1z M47,5h3v4h-3z M77,5h3v4h-3z M45,6h2v2h-2z M50,6h2v2h-2z M75,6h2v2h-2z M80,6h2v2h-2z M44,7h1v4h-1z M82,7h1v4h-1z M45,8h1v5h-1z M81,8h1v5h-1z M48,9h2v1h-2z M77,9h2v1h-2z M46,11h1v2h-1z M80,11h1v2h-1z M54,15h4v6h-4z M69,15h4v6h-4z M52,16h2v7h-2z M58,16h1v4h-1z M68,16h1v4h-1z M73,16h2v7h-2z M51,17h1v6h-1z M59,17h1v2h-1z M67,17h1v2h-1z M75,17h1v6h-1z M50,18h1v4h-1z M76,18h1v4h-1z M54,21h2v1h-2z M71,21h2v1h-2z M48,27h3v1h-3z M55,27h1v9h-1z M71,27h1v9h-1z M76,27h3v1h-3z M46,28h4v1h-4z M53,28h2v9h-2z M56,28h15v7h-15z M72,28h2v9h-2z M77,28h4v1h-4z M44,29h5v1h-5z M51,29h2v8h-2z M74,29h2v8h-2z M78,29h5v1h-5z M43,30h4v1h-4z M49,30h2v7h-2z M76,30h2v7h-2z M80,30h4v1h-4z M41,31h5v1h-5z M48,31h1v6h-1z M78,31h1v6h-1z M81,31h5v1h-5z M39,32h6v1h-6z M47,32h1v5h-1z M79,32h1v5h-1z M82,32h6v1h-6z M38,33h6v1h-6z M45,33h2v3h-2z M80,33h2v3h-2z M83,33h6v1h-6z M39,34h6v1h-6z M82,34h6v1h-6z M42,35h3v1h-3z M56,35h4v1h-4z M67,35h4v1h-4z M82,35h3v1h-3z"
          />
          <path
            fill="#DDDED9"
            d="M53,15h1v1h-1z M73,15h1v1h-1z M51,16h1v1h-1z M59,16h1v1h-1z M67,16h1v1h-1z M75,16h1v1h-1z M60,6h7v12h-7z M56,7h4v8h-4z M67,7h4v8h-4z M53,8h3v7h-3z M71,8h3v7h-3z M51,9h2v7h-2z M74,9h2v7h-2z M50,10h1v8h-1z M76,10h1v8h-1z M49,11h1v13h-1z M77,11h1v13h-1z M48,12h1v12h-1z M78,12h1v12h-1z M47,13h1v10h-1z M79,13h1v10h-1z M46,15h1v7h-1z M58,15h2v1h-2z M67,15h2v1h-2z M80,15h1v7h-1z M45,17h1v4h-1z M81,17h1v4h-1z M60,18h2v1h-2z M65,18h2v1h-2z M59,19h2v7h-2z M66,19h2v7h-2z M58,20h1v6h-1z M68,20h1v6h-1z M56,21h2v5h-2z M61,21h2v2h-2z M64,21h2v2h-2z M69,21h2v5h-2z M50,22h1v2h-1z M54,22h2v3h-2z M71,22h2v3h-2z M76,22h1v2h-1z M51,23h3v2h-3z M63,23h1v3h-1z M73,23h3v2h-3z M61,24h2v2h-2z M64,24h2v2h-2z"
          />
          <path
            fill="#313132"
            d="M48,10h1v1h-1z M78,10h1v1h-1z M47,27h1v1h-1z M79,27h1v1h-1z M42,30h1v1h-1z M84,30h1v1h-1z M34,32h1v1h-1z M92,32h1v1h-1z M44,33h1v1h-1z M82,33h1v1h-1z M46,8h1v3h-1z M80,8h1v3h-1z M47,9h1v3h-1z M79,9h1v3h-1z M42,24h2v6h-2z M83,24h2v6h-2z M41,25h1v6h-1z M44,25h3v3h-3z M80,25h3v3h-3z M85,25h1v6h-1z M40,26h1v6h-1z M47,26h3v1h-3z M77,26h3v1h-3z M86,26h1v6h-1z M39,27h1v5h-1z M51,27h4v1h-4z M72,27h4v1h-4z M87,27h1v5h-1z M38,28h1v5h-1z M44,28h2v1h-2z M50,28h3v1h-3z M74,28h3v1h-3z M81,28h2v1h-2z M88,28h1v5h-1z M37,29h1v5h-1z M49,29h2v1h-2z M76,29h2v1h-2z M89,29h1v5h-1z M36,30h1v4h-1z M47,30h2v1h-2z M78,30h2v1h-2z M90,30h1v4h-1z M35,31h1v2h-1z M46,31h2v1h-2z M79,31h2v1h-2z M91,31h1v2h-1z M45,32h2v1h-2z M80,32h2v1h-2z"
          />
          <path
            fill="#B0B3AC"
            d="M44,21h2v3h-2z M81,21h2v3h-2z M46,22h1v2h-1z M80,22h1v2h-1z M47,23h1v2h-1z M79,23h1v2h-1z M48,24h3v1h-3z M76,24h3v1h-3z M50,25h6v1h-6z M71,25h6v1h-6z M56,26h15v1h-15z"
          />
        </g>
      );
    case 12: // pirate
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M72,11h1v1h-1z M79,12h1v1h-1z M80,13h1v1h-1z M38,16h1v1h-1z M37,17h1v1h-1z M36,18h1v1h-1z M35,19h1v1h-1z M85,19h1v1h-1z M37,24h1v1h-1z M36,25h1v1h-1z M29,26h1v1h-1z M35,26h1v1h-1z M34,27h1v1h-1z M32,29h1v1h-1z M87,29h1v1h-1z M25,30h1v1h-1z M29,31h1v1h-1z M30,40h1v1h-1z M28,47h1v1h-1z M19,48h1v1h-1z M27,48h1v1h-1z M18,49h1v1h-1z M17,50h1v1h-1z M16,51h1v1h-1z M24,53h1v1h-1z M23,54h1v1h-1z M21,56h1v1h-1z M27,58h1v1h-1z M26,59h1v1h-1z M23,68h1v1h-1z M63,9h8v1h-8z M56,10h7v1h-7z M71,10h1v2h-1z M73,10h4v1h-4z M52,11h4v1h-4z M77,11h2v1h-2z M50,12h2v1h-2z M45,13h5v1h-5z M41,14h4v1h-4z M81,14h1v2h-1z M39,15h2v1h-2z M82,16h2v1h-2z M84,17h1v2h-1z M34,20h1v2h-1z M86,20h1v3h-1z M33,22h1v7h-1z M38,23h3v1h-3z M87,23h1v3h-1z M30,25h3v1h-3z M88,26h1v4h-1z M28,27h1v4h-1z M26,29h2v1h-2z M31,30h1v2h-1z M89,30h1v3h-1z M24,31h1v3h-1z M30,32h1v3h-1z M87,32h2v1h-2z M85,33h2v1h-2z M23,34h1v5h-1z M83,34h2v1h-2z M29,35h1v5h-1z M79,35h4v1h-4z M75,36h4v1h-4z M71,37h4v1h-4z M66,38h5v1h-5z M22,39h1v5h-1z M61,39h5v1h-5z M56,40h5v1h-5z M29,41h1v2h-1z M51,41h5v1h-5z M44,42h7v1h-7z M30,43h14v1h-14z M21,44h1v2h-1z M30,44h1v2h-1z M20,46h1v2h-1z M29,46h1v5h-1z M26,49h1v2h-1z M25,51h1v2h-1z M28,51h1v8h-1z M14,52h2v1h-2z M10,53h4v1h-4z M11,54h2v1h-2z M13,55h10v1h-10z M20,57h1v6h-1z M25,60h1v2h-1z M24,62h1v6h-1z M21,63h1v3h-1z M22,66h1v2h-1z"
          />
          <path
            fill="#D82626"
            d="M77,18h1v1h-1z M52,19h1v1h-1z M74,21h1v1h-1z M61,26h1v1h-1z M54,27h1v1h-1z M63,28h1v1h-1z M51,31h1v1h-1z M72,33h1v1h-1z M51,34h1v1h-1z M60,39h1v1h-1z M55,40h1v1h-1z M24,50h1v1h-1z M13,54h1v1h-1z M63,10h7v2h-7z M56,11h7v7h-7z M74,11h3v9h-3z M52,12h4v6h-4z M63,12h6v5h-6z M77,12h2v6h-2z M50,13h2v8h-2z M73,13h1v10h-1z M79,13h1v3h-1z M45,14h5v21h-5z M41,15h4v22h-4z M39,16h2v7h-2z M72,16h1v7h-1z M38,17h1v6h-1z M63,17h5v3h-5z M71,17h1v7h-1z M83,17h1v14h-1z M37,18h1v5h-1z M52,18h2v1h-2z M58,18h5v1h-5z M70,18h1v6h-1z M82,18h1v13h-1z M36,19h1v4h-1z M60,19h3v1h-3z M69,19h1v6h-1z M81,19h1v12h-1z M84,19h1v11h-1z M35,20h1v3h-1z M61,20h6v1h-6z M68,20h1v6h-1z M74,20h2v1h-2z M80,20h1v12h-1z M85,20h1v10h-1z M50,21h1v6h-1z M61,21h5v1h-5z M67,21h1v6h-1z M79,21h1v11h-1z M34,22h1v2h-1z M61,22h4v4h-4z M66,22h1v6h-1z M78,22h1v10h-1z M65,23h1v5h-1z M77,23h1v10h-1z M86,23h1v6h-1z M38,24h3v17h-3z M51,24h1v3h-1z M60,24h1v3h-1z M76,24h1v9h-1z M37,25h1v16h-1z M52,25h1v3h-1z M75,25h1v8h-1z M30,26h3v1h-3z M36,26h1v15h-1z M53,26h1v2h-1z M59,26h1v2h-1z M64,26h1v3h-1z M74,26h1v7h-1z M87,26h1v3h-1z M29,27h2v1h-2z M35,27h1v14h-1z M58,27h1v2h-1z M72,27h2v6h-2z M29,28h1v2h-1z M34,28h1v12h-1z M55,28h3v1h-3z M71,28h1v6h-1z M33,29h1v11h-1z M50,29h1v6h-1z M61,29h2v1h-2z M69,29h2v5h-2z M26,30h2v4h-2z M32,30h1v10h-1z M51,30h3v1h-3z M67,30h2v5h-2z M88,30h1v2h-1z M25,31h1v12h-1z M28,31h1v2h-1z M57,31h2v1h-2z M66,31h1v4h-1z M85,31h3v1h-3z M31,32h1v7h-1z M55,32h3v1h-3z M65,32h1v3h-1z M82,32h5v1h-5z M53,33h3v1h-3z M61,33h4v2h-4z M79,33h6v1h-6z M24,34h1v14h-1z M26,34h1v2h-1z M58,34h3v2h-3z M75,34h8v1h-8z M30,35h1v4h-1z M45,35h3v1h-3z M55,35h3v5h-3z M61,35h3v1h-3z M71,35h8v1h-8z M51,36h4v5h-4z M58,36h2v4h-2z M66,36h9v1h-9z M41,37h1v6h-1z M47,37h4v5h-4z M60,37h11v1h-11z M42,38h5v4h-5z M60,38h6v1h-6z M23,39h1v11h-1z M30,41h4v2h-4z M40,41h1v2h-1z M34,42h6v1h-6z M42,42h2v1h-2z M22,44h1v7h-1z M21,46h1v6h-1z M20,48h1v7h-1z M19,49h1v6h-1z M18,50h1v5h-1z M17,51h1v4h-1z M23,51h1v2h-1z M16,52h1v3h-1z M22,52h1v3h-1z M14,53h2v2h-2z M21,53h1v2h-1z M24,55h1v4h-1z M22,56h2v10h-2z M21,57h1v6h-1z M23,66h1v2h-1z"
          />
          <path
            fill="#A41029"
            d="M71,16h1v1h-1z M82,17h1v1h-1z M67,20h1v1h-1z M66,21h1v1h-1z M65,22h1v1h-1z M34,26h1v1h-1z M70,28h1v1h-1z M31,29h1v1h-1z M29,30h1v1h-1z M64,30h1v1h-1z M87,30h1v1h-1z M65,31h1v1h-1z M29,40h1v1h-1z M23,50h1v1h-1z M22,51h1v1h-1z M21,52h1v1h-1z M23,53h1v1h-1z M24,54h1v1h-1z M23,55h1v1h-1z M70,10h1v8h-1z M73,11h1v2h-1z M69,12h1v7h-1z M71,12h2v4h-2z M80,14h1v6h-1z M79,16h1v5h-1z M81,16h1v3h-1z M68,17h1v3h-1z M78,18h1v4h-1z M77,19h1v4h-1z M76,20h1v4h-1z M75,21h1v4h-1z M74,22h1v4h-1z M35,23h3v1h-3z M72,23h2v4h-2z M34,24h3v1h-3z M70,24h2v4h-2z M34,25h2v1h-2z M69,25h1v4h-1z M68,26h1v4h-1z M31,27h2v2h-2z M67,27h1v3h-1z M30,28h1v4h-1z M65,28h2v3h-2z M63,29h2v1h-2z M86,29h1v2h-1z M84,30h2v1h-2z M81,31h4v1h-4z M29,32h1v3h-1z M58,32h5v1h-5z M78,32h4v1h-4z M28,33h1v14h-1z M56,33h5v1h-5z M73,33h6v1h-6z M27,34h1v14h-1z M52,34h6v1h-6z M69,34h6v1h-6z M48,35h7v1h-7z M64,35h7v1h-7z M26,36h1v13h-1z M45,36h6v1h-6z M60,36h6v1h-6z M42,37h5v1h-5z M30,39h2v1h-2z M31,40h4v1h-4z M34,41h6v1h-6z M25,43h1v8h-1z M29,43h1v3h-1z M24,48h1v2h-1z M28,48h1v3h-1z M27,49h1v9h-1z M24,51h1v2h-1z M26,51h1v8h-1z M25,53h1v7h-1z M24,59h1v3h-1z"
          />
          <path
            fill="#CDCDDE"
            d="M54,25h1v1h-1z M58,25h1v1h-1z M61,30h1v1h-1z M59,31h1v1h-1z M64,32h1v1h-1z M54,18h4v3h-4z M53,19h1v3h-1z M58,19h2v2h-2z M52,20h1v4h-1z M60,20h1v4h-1z M51,21h1v3h-1z M54,21h3v1h-3z M59,21h1v4h-1z M55,22h2v1h-2z M57,23h2v2h-2z M53,24h4v1h-4z M62,26h2v2h-2z M50,27h2v1h-2z M60,27h2v1h-2z M51,28h4v1h-4z M59,28h2v1h-2z M54,29h5v1h-5z M56,30h3v1h-3z M52,31h5v1h-5z M51,32h2v1h-2z"
          />
          <path fill="#303032" d="M57,21h2v2h-2z M53,22h2v2h-2z M55,25h3v2h-3z" />
          <path
            fill="#A9A3BC"
            d="M52,24h1v1h-1z M53,25h1v1h-1z M59,25h1v1h-1z M54,26h1v1h-1z M58,26h1v1h-1z M50,28h1v1h-1z M64,31h1v1h-1z M63,32h1v1h-1z M55,23h2v1h-2z M55,27h3v1h-3z M61,28h2v1h-2z M51,29h3v1h-3z M59,29h2v2h-2z M54,30h2v1h-2z M62,30h2v2h-2z M60,31h2v1h-2z M53,32h2v1h-2z M51,33h2v1h-2z"
          />
        </g>
      );
    case 13: // bear
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M48,5h1v1h-1z M78,5h1v1h-1z M33,6h1v1h-1z M49,6h1v1h-1z M77,6h1v1h-1z M93,6h1v1h-1z M33,20h1v1h-1z M93,20h1v1h-1z M34,21h1v1h-1z M92,21h1v1h-1z M51,24h1v1h-1z M71,24h1v1h-1z M57,26h1v1h-1z M69,26h1v1h-1z M56,27h1v1h-1z M70,27h1v1h-1z M55,28h1v1h-1z M71,28h1v1h-1z M39,35h1v1h-1z M87,35h1v1h-1z M38,36h1v1h-1z M55,36h1v1h-1z M71,36h1v1h-1z M88,36h1v1h-1z M37,37h1v1h-1z M56,37h1v1h-1z M70,37h1v1h-1z M89,37h1v1h-1z M57,38h1v1h-1z M69,38h1v1h-1z M30,64h1v1h-1z M96,64h1v1h-1z M29,65h1v1h-1z M97,65h1v1h-1z M28,66h1v1h-1z M35,66h1v1h-1z M91,66h1v1h-1z M98,66h1v1h-1z M28,71h1v1h-1z M35,71h1v1h-1z M91,71h1v1h-1z M98,71h1v1h-1z M29,72h1v1h-1z M34,72h1v1h-1z M92,72h1v1h-1z M97,72h1v1h-1z M38,3h8v1h-8z M81,3h8v1h-8z M36,4h2v1h-2z M46,4h2v1h-2z M57,4h13v1h-13z M79,4h2v1h-2z M89,4h2v1h-2z M34,5h2v1h-2z M54,5h3v1h-3z M70,5h3v1h-3z M91,5h2v1h-2z M52,6h2v1h-2z M73,6h2v1h-2z M32,7h1v3h-1z M50,7h2v1h-2z M75,7h2v1h-2z M94,7h1v3h-1z M31,10h1v8h-1z M95,10h1v8h-1z M32,18h1v2h-1z M94,18h1v2h-1z M52,19h3v2h-3z M72,19h3v2h-3z M51,20h1v3h-1z M55,20h1v5h-1z M71,20h1v3h-1z M75,20h1v5h-1z M50,21h1v3h-1z M52,21h2v3h-2z M56,21h1v3h-1z M70,21h1v3h-1z M72,21h2v3h-2z M76,21h1v3h-1z M35,22h1v5h-1z M54,22h1v4h-1z M74,22h1v4h-1z M91,22h1v5h-1z M61,24h5v1h-5z M52,25h2v1h-2z M58,25h3v1h-3z M66,25h3v1h-3z M72,25h2v1h-2z M34,27h1v5h-1z M92,27h1v5h-1z M54,29h1v2h-1z M72,29h1v2h-1z M61,30h5v2h-5z M53,31h1v3h-1z M60,31h1v5h-1z M66,31h1v5h-1z M73,31h1v3h-1z M33,32h1v5h-1z M59,32h1v3h-1z M61,32h3v5h-3z M67,32h1v3h-1z M93,32h1v5h-1z M64,33h2v4h-2z M40,34h3v1h-3z M50,34h3v1h-3z M54,34h1v2h-1z M72,34h1v2h-1z M74,34h3v1h-3z M84,34h3v1h-3z M43,35h7v1h-7z M77,35h7v1h-7z M32,37h1v3h-1z M62,37h3v1h-3z M94,37h1v3h-1z M36,38h1v2h-1z M63,38h1v3h-1z M90,38h1v2h-1z M58,39h2v1h-2z M67,39h2v1h-2z M31,40h1v9h-1z M35,40h1v3h-1z M60,40h3v1h-3z M64,40h3v1h-3z M91,40h1v3h-1z M95,40h1v9h-1z M34,43h1v3h-1z M92,43h1v3h-1z M35,46h1v17h-1z M91,46h1v17h-1z M32,49h1v5h-1z M94,49h1v5h-1z M31,54h1v11h-1z M95,54h1v11h-1z M34,63h1v3h-1z M92,63h1v3h-1z M27,67h1v4h-1z M36,67h1v4h-1z M90,67h1v4h-1z M99,67h1v4h-1z M30,73h4v1h-4z M93,73h4v1h-4z"
          />
          <path
            fill="#E9F0FA"
            d="M46,6h1v1h-1z M80,6h1v1h-1z M36,8h1v1h-1z M90,8h1v1h-1z M55,19h1v1h-1z M71,19h1v1h-1z M50,20h1v1h-1z M76,20h1v1h-1z M54,21h1v1h-1z M74,21h1v1h-1z M57,25h1v1h-1z M69,25h1v1h-1z M52,26h1v1h-1z M55,26h1v1h-1z M71,26h1v1h-1z M74,26h1v1h-1z M52,29h1v1h-1z M74,29h1v1h-1z M82,30h1v1h-1z M34,66h1v1h-1z M92,66h1v1h-1z M28,67h1v1h-1z M35,67h1v1h-1z M91,67h1v1h-1z M98,67h1v1h-1z M34,68h1v1h-1z M92,68h1v1h-1z M30,69h1v1h-1z M32,69h1v1h-1z M35,69h1v1h-1z M91,69h1v1h-1z M94,69h1v1h-1z M96,69h1v1h-1z M29,70h1v1h-1z M97,70h1v1h-1z M34,71h1v1h-1z M92,71h1v1h-1z M38,4h8v3h-8z M81,4h8v3h-8z M36,5h2v3h-2z M46,5h2v1h-2z M57,5h13v8h-13z M79,5h2v1h-2z M89,5h2v3h-2z M34,6h2v4h-2z M54,6h3v7h-3z M70,6h3v7h-3z M91,6h2v4h-2z M33,7h1v13h-1z M38,7h6v1h-6z M52,7h2v4h-2z M73,7h2v12h-2z M83,7h6v1h-6z M93,7h1v13h-1z M50,8h2v12h-2z M75,8h2v12h-2z M48,9h2v23h-2z M77,9h2v23h-2z M32,10h1v8h-1z M34,10h1v11h-1z M46,10h2v15h-2z M79,10h2v21h-2z M92,10h1v11h-1z M94,10h1v8h-1z M45,11h1v20h-1z M52,11h1v8h-1z M81,11h1v16h-1z M44,12h1v19h-1z M53,12h1v7h-1z M82,12h1v16h-1z M43,13h1v9h-1z M54,13h2v6h-2z M59,13h9v1h-9z M71,13h2v6h-2z M83,13h1v6h-1z M42,14h1v9h-1z M56,14h1v7h-1z M60,14h7v2h-7z M70,14h1v7h-1z M84,14h1v15h-1z M41,15h1v11h-1z M57,15h2v10h-2z M68,15h2v10h-2z M85,15h1v9h-1z M35,16h1v4h-1z M40,16h1v10h-1z M59,16h1v9h-1z M61,16h5v8h-5z M67,16h1v9h-1z M86,16h1v17h-1z M91,16h1v4h-1z M36,17h1v2h-1z M39,17h1v10h-1z M87,17h1v8h-1z M90,17h1v2h-1z M60,18h1v7h-1z M66,18h1v7h-1z M38,19h1v14h-1z M88,19h1v6h-1z M83,20h1v9h-1z M37,21h1v13h-1z M89,21h1v13h-1z M36,23h1v12h-1z M90,23h1v12h-1z M42,24h2v2h-2z M50,24h1v7h-1z M56,24h1v3h-1z M70,24h1v3h-1z M76,24h1v7h-1z M47,25h1v6h-1z M51,25h1v6h-1z M75,25h1v6h-1z M85,25h1v5h-1z M43,26h1v7h-1z M46,26h1v5h-1z M35,27h1v10h-1z M41,27h2v6h-2z M72,27h2v1h-2z M87,27h1v6h-1z M91,27h1v10h-1z M40,28h1v5h-1z M52,28h2v1h-2z M73,28h2v1h-2z M88,28h1v5h-1z M39,29h1v4h-1z M81,29h1v2h-1z M83,31h3v2h-3z M34,32h1v7h-1z M44,32h2v1h-2z M64,32h2v1h-2z M81,32h2v1h-2z M92,32h1v7h-1z M33,37h1v5h-1z M93,37h1v5h-1z M32,40h1v9h-1z M94,40h1v9h-1z M33,46h1v11h-1z M93,46h1v11h-1z M32,54h1v14h-1z M94,54h1v14h-1z M33,64h1v2h-1z M93,64h1v2h-1z M30,65h2v1h-2z M95,65h2v1h-2z M29,66h1v2h-1z M97,66h1v2h-1z M33,67h1v2h-1z M93,67h1v2h-1z M30,68h2v1h-2z M95,68h2v1h-2z M28,69h1v2h-1z M98,69h1v2h-1z M31,70h1v2h-1z M33,70h2v1h-2z M92,70h2v1h-2z M95,70h1v2h-1z M30,71h1v2h-1z M96,71h1v2h-1z M32,72h2v1h-2z M93,72h2v1h-2z"
          />
          <path
            fill="#B8C3D5"
            d="M49,7h1v1h-1z M77,7h1v1h-1z M47,8h1v1h-1z M79,8h1v1h-1z M53,11h1v1h-1z M41,13h1v1h-1z M85,13h1v1h-1z M39,15h1v1h-1z M59,15h1v1h-1z M67,15h1v1h-1z M87,15h1v1h-1z M83,19h1v1h-1z M42,23h1v1h-1z M85,24h1v1h-1z M46,25h1v1h-1z M55,25h1v1h-1z M71,25h1v1h-1z M52,27h1v1h-1z M55,27h1v1h-1z M71,27h1v1h-1z M74,27h1v1h-1z M88,27h1v1h-1z M39,28h1v1h-1z M54,28h1v1h-1z M72,28h1v1h-1z M85,30h1v1h-1z M51,31h1v1h-1z M75,31h1v1h-1z M34,67h1v1h-1z M92,67h1v1h-1z M28,68h1v1h-1z M35,68h1v1h-1z M91,68h1v1h-1z M98,68h1v1h-1z M29,69h1v1h-1z M31,69h1v1h-1z M33,69h1v1h-1z M93,69h1v1h-1z M95,69h1v1h-1z M97,69h1v1h-1z M32,70h1v1h-1z M35,70h1v1h-1z M91,70h1v1h-1z M94,70h1v1h-1z M29,71h1v1h-1z M33,71h1v1h-1z M93,71h1v1h-1z M97,71h1v1h-1z M31,72h1v1h-1z M95,72h1v1h-1z M47,6h2v2h-2z M78,6h2v2h-2z M44,7h3v2h-3z M80,7h3v2h-3z M36,11h3v6h-3z M88,11h3v6h-3z M35,12h1v4h-1z M39,12h2v3h-2z M86,12h2v3h-2z M91,12h1v4h-1z M56,13h3v1h-3z M68,13h3v1h-3z M57,14h3v1h-3z M67,14h3v1h-3z M60,16h1v2h-1z M66,16h1v2h-1z M37,17h1v2h-1z M89,17h1v2h-1z M36,19h1v2h-1z M90,19h1v2h-1z M35,20h1v2h-1z M91,20h1v2h-1z M43,22h1v2h-1z M87,25h2v2h-2z M40,26h3v1h-3z M53,26h2v2h-2z M72,26h2v1h-2z M39,27h2v1h-2z M81,27h1v2h-1z M82,28h1v2h-1z M53,29h1v2h-1z M73,29h1v2h-1z M83,29h2v2h-2z M52,30h1v2h-1z M74,30h1v2h-1z M44,31h4v1h-4z M79,31h4v1h-4z M46,32h2v1h-2z M49,32h1v2h-1z M77,32h1v2h-1z M79,32h2v1h-2z M38,33h9v1h-9z M80,33h9v1h-9z M37,34h3v1h-3z M43,34h3v1h-3z M81,34h3v1h-3z M87,34h3v1h-3z M36,35h3v1h-3z M88,35h3v1h-3z M36,36h2v1h-2z M89,36h2v1h-2z M35,37h2v1h-2z M90,37h2v1h-2z M35,38h1v2h-1z M91,38h1v2h-1z M34,39h1v4h-1z M92,39h1v4h-1z M33,42h1v4h-1z M93,42h1v4h-1z M34,46h1v17h-1z M92,46h1v17h-1z M33,57h1v7h-1z M93,57h1v7h-1z M30,66h2v2h-2z M95,66h2v2h-2z"
          />
          <path
            fill="#949CB4"
            d="M42,13h1v1h-1z M84,13h1v1h-1z M41,14h1v1h-1z M85,14h1v1h-1z M40,15h1v1h-1z M86,15h1v1h-1z M39,16h1v1h-1z M87,16h1v1h-1z M46,34h1v1h-1z M49,34h1v1h-1z M77,34h1v1h-1z M80,34h1v1h-1z M33,66h1v1h-1z M93,66h1v1h-1z M29,68h1v1h-1z M32,68h1v1h-1z M94,68h1v1h-1z M97,68h1v1h-1z M34,69h1v1h-1z M92,69h1v1h-1z M30,70h1v1h-1z M96,70h1v1h-1z M32,71h1v1h-1z M94,71h1v1h-1z M37,8h7v3h-7z M48,8h2v1h-2z M77,8h2v1h-2z M83,8h7v3h-7z M36,9h1v2h-1z M44,9h4v1h-4z M79,9h4v1h-4z M90,9h1v2h-1z M35,10h1v2h-1z M44,10h2v1h-2z M81,10h2v1h-2z M91,10h1v2h-1z M39,11h6v1h-6z M82,11h6v1h-6z M41,12h3v1h-3z M83,12h3v1h-3z M38,17h1v2h-1z M88,17h1v2h-1z M37,19h1v2h-1z M89,19h1v2h-1z M36,21h1v2h-1z M90,21h1v2h-1z M50,31h1v3h-1z M76,31h1v3h-1z M48,32h1v3h-1z M51,32h2v2h-2z M74,32h2v2h-2z M78,32h1v3h-1z M47,33h1v2h-1z M79,33h1v2h-1z"
          />
          <path
            fill="#A475C9"
            d="M51,23h1v1h-1z M71,23h1v1h-1z M52,24h2v1h-2z M72,24h2v1h-2z"
          />
          <path
            fill="#E6F3EC"
            d="M60,36h1v1h-1z M66,36h1v1h-1z M61,25h5v5h-5z M58,26h3v5h-3z M66,26h3v5h-3z M57,27h1v9h-1z M69,27h1v9h-1z M56,28h1v7h-1z M70,28h1v7h-1z M55,29h1v5h-1z M71,29h1v5h-1z M58,31h2v1h-2z M67,31h2v1h-2z M58,32h1v5h-1z M68,32h1v5h-1z M59,35h1v2h-1z M67,35h1v2h-1z"
          />
          <path
            fill="#AFCFCB"
            d="M54,31h1v3h-1z M72,31h1v3h-1z M55,34h1v2h-1z M71,34h1v2h-1z M56,35h1v2h-1z M70,35h1v2h-1z M57,36h1v2h-1z M69,36h1v2h-1z M58,37h4v2h-4z M65,37h4v2h-4z M62,38h1v2h-1z M64,38h1v2h-1z M60,39h2v1h-2z M65,39h2v1h-2z"
          />
        </g>
      );
    case 14: // sea lion
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M47,9h1v1h-1z M79,9h1v1h-1z M44,11h1v1h-1z M82,11h1v1h-1z M41,13h1v1h-1z M85,13h1v1h-1z M40,14h1v1h-1z M86,14h1v1h-1z M39,15h1v1h-1z M87,15h1v1h-1z M38,16h1v1h-1z M88,16h1v1h-1z M37,17h1v1h-1z M89,17h1v1h-1z M36,18h1v1h-1z M90,18h1v1h-1z M52,20h1v1h-1z M74,20h1v1h-1z M34,21h1v1h-1z M92,21h1v1h-1z M34,28h1v1h-1z M63,28h1v1h-1z M92,28h1v1h-1z M33,29h1v1h-1z M93,29h1v1h-1z M32,30h1v1h-1z M94,30h1v1h-1z M24,33h1v1h-1z M102,33h1v1h-1z M35,39h1v1h-1z M91,39h1v1h-1z M34,40h1v1h-1z M92,40h1v1h-1z M32,43h1v1h-1z M94,43h1v1h-1z M31,44h1v1h-1z M95,44h1v1h-1z M59,5h9v1h-9z M54,6h5v1h-5z M68,6h5v1h-5z M50,7h4v1h-4z M73,7h4v1h-4z M48,8h2v1h-2z M77,8h2v1h-2z M45,10h2v1h-2z M80,10h2v1h-2z M42,12h2v1h-2z M58,12h2v1h-2z M67,12h2v1h-2z M83,12h2v1h-2z M57,13h2v1h-2z M68,13h2v1h-2z M51,14h3v2h-3z M56,14h2v1h-2z M69,14h2v1h-2z M73,14h3v2h-3z M50,15h1v5h-1z M54,15h1v5h-1z M72,15h1v5h-1z M76,15h1v5h-1z M49,16h1v3h-1z M51,16h1v5h-1z M55,16h1v3h-1z M71,16h1v3h-1z M73,16h1v5h-1z M77,16h1v3h-1z M52,18h2v1h-2z M74,18h2v1h-2z M35,19h1v2h-1z M53,19h1v2h-1z M75,19h1v2h-1z M91,19h1v2h-1z M62,20h3v2h-3z M61,21h1v6h-1z M65,21h1v6h-1z M33,22h1v2h-1z M60,22h1v4h-1z M62,22h1v6h-1z M66,22h1v4h-1z M93,22h1v2h-1z M63,23h2v5h-2z M32,24h1v3h-1z M94,24h1v3h-1z M31,27h1v4h-1z M95,27h1v4h-1z M29,31h2v1h-2z M96,31h2v1h-2z M25,32h4v1h-4z M58,32h11v1h-11z M98,32h4v1h-4z M51,33h7v1h-7z M69,33h7v1h-7z M23,34h1v4h-1z M47,34h4v1h-4z M76,34h4v1h-4z M103,34h1v4h-1z M43,35h4v1h-4z M80,35h4v1h-4z M40,36h3v1h-3z M84,36h3v1h-3z M38,37h2v1h-2z M87,37h2v1h-2z M24,38h2v1h-2z M36,38h2v1h-2z M89,38h2v1h-2z M101,38h2v1h-2z M26,39h4v1h-4z M97,39h4v1h-4z M29,40h1v3h-1z M97,40h1v3h-1z M33,41h1v2h-1z M93,41h1v2h-1z M30,43h1v3h-1z M96,43h1v3h-1z"
          />
          <path
            fill="#D8D6D2"
            d="M50,14h1v1h-1z M76,14h1v1h-1z M60,21h1v1h-1z M66,21h1v1h-1z M51,23h1v1h-1z M75,23h1v1h-1z M53,25h1v1h-1z M73,25h1v1h-1z M63,29h1v1h-1z M37,34h1v1h-1z M89,34h1v1h-1z M31,35h1v1h-1z M95,35h1v1h-1z M29,36h1v1h-1z M97,36h1v1h-1z M59,6h9v6h-9z M54,7h5v5h-5z M68,7h5v5h-5z M50,8h4v6h-4z M73,8h4v6h-4z M48,9h2v7h-2z M77,9h2v7h-2z M47,10h1v21h-1z M79,10h1v21h-1z M45,11h2v21h-2z M80,11h2v21h-2z M44,12h1v20h-1z M54,12h4v1h-4z M60,12h7v8h-7z M69,12h4v1h-4z M82,12h1v20h-1z M42,13h2v20h-2z M54,13h3v1h-3z M59,13h1v9h-1z M67,13h1v9h-1z M70,13h3v1h-3z M83,13h2v20h-2z M41,14h1v19h-1z M54,14h2v1h-2z M58,14h1v8h-1z M68,14h1v8h-1z M71,14h2v1h-2z M85,14h1v19h-1z M40,15h1v19h-1z M55,15h3v1h-3z M69,15h3v1h-3z M86,15h1v19h-1z M39,16h1v19h-1z M48,16h1v15h-1z M56,16h2v6h-2z M69,16h2v6h-2z M78,16h1v15h-1z M87,16h1v19h-1z M38,17h1v18h-1z M88,17h1v18h-1z M37,18h1v15h-1z M89,18h1v15h-1z M36,19h1v14h-1z M49,19h1v12h-1z M55,19h1v3h-1z M71,19h1v3h-1z M77,19h1v12h-1z M90,19h1v14h-1z M50,20h1v11h-1z M54,20h1v2h-1z M60,20h2v1h-2z M65,20h2v1h-2z M72,20h1v2h-1z M76,20h1v11h-1z M35,21h1v13h-1z M51,21h3v2h-3z M73,21h3v2h-3z M91,21h1v13h-1z M34,22h1v6h-1z M92,22h1v6h-1z M54,23h6v3h-6z M67,23h6v3h-6z M33,24h1v5h-1z M52,24h2v1h-2z M73,24h2v1h-2z M93,24h1v5h-1z M32,27h1v3h-1z M51,27h1v4h-1z M75,27h1v4h-1z M94,27h1v3h-1z M52,28h1v3h-1z M59,28h4v2h-4z M64,28h4v2h-4z M74,28h1v3h-1z M34,29h1v5h-1z M53,29h6v1h-6z M68,29h6v1h-6z M92,29h1v5h-1z M33,30h1v5h-1z M53,30h3v1h-3z M71,30h3v1h-3z M93,30h1v5h-1z M31,31h2v4h-2z M94,31h2v4h-2z M29,32h2v4h-2z M96,32h2v4h-2z M25,33h4v4h-4z M98,33h4v4h-4z M24,34h1v2h-1z M102,34h1v2h-1z"
          />
          <path fill="#EAF5F5" d="M52,16h2v2h-2z M74,16h2v2h-2z M63,22h2v1h-2z" />
          <path fill="#ABBFC8" d="M52,19h1v1h-1z M74,19h1v1h-1z" />
          <path
            fill="#858C79"
            d="M52,27h1v1h-1z M74,27h1v1h-1z M31,40h1v1h-1z M95,40h1v1h-1z M32,41h1v1h-1z M94,41h1v1h-1z M54,22h6v1h-6z M67,22h6v1h-6z M52,23h2v1h-2z M73,23h2v1h-2z M51,24h1v3h-1z M75,24h1v3h-1z M59,27h3v1h-3z M65,27h3v1h-3z M53,28h6v1h-6z M68,28h6v1h-6z M36,34h1v2h-1z M90,34h1v2h-1z M35,35h1v2h-1z M91,35h1v2h-1z M34,36h1v3h-1z M92,36h1v3h-1z M32,37h2v4h-2z M93,37h2v4h-2z M30,38h2v2h-2z M95,38h2v2h-2z"
          />
          <path
            fill="#B3B6A2"
            d="M37,37h1v1h-1z M89,37h1v1h-1z M34,39h1v1h-1z M92,39h1v1h-1z M32,42h1v1h-1z M94,42h1v1h-1z M52,25h1v2h-1z M74,25h1v2h-1z M53,26h8v1h-8z M66,26h8v1h-8z M53,27h6v1h-6z M68,27h6v1h-6z M56,30h15v2h-15z M47,31h9v2h-9z M71,31h9v2h-9z M44,32h3v3h-3z M56,32h2v1h-2z M69,32h2v1h-2z M80,32h3v3h-3z M36,33h2v1h-2z M41,33h3v2h-3z M47,33h4v1h-4z M76,33h4v1h-4z M83,33h3v2h-3z M89,33h2v1h-2z M34,34h2v1h-2z M40,34h1v2h-1z M86,34h1v2h-1z M91,34h2v1h-2z M32,35h3v1h-3z M37,35h3v2h-3z M41,35h2v1h-2z M84,35h2v1h-2z M87,35h3v2h-3z M92,35h3v1h-3z M24,36h1v2h-1z M30,36h4v1h-4z M36,36h1v2h-1z M90,36h1v2h-1z M93,36h4v1h-4z M102,36h1v2h-1z M25,37h7v1h-7z M35,37h1v2h-1z M91,37h1v2h-1z M95,37h7v1h-7z M26,38h4v1h-4z M97,38h4v1h-4z M30,40h1v3h-1z M96,40h1v3h-1z M31,41h1v3h-1z M95,41h1v3h-1z"
          />
        </g>
      );
    case 15: // shark
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M61,4h1v1h-1z M65,4h1v1h-1z M60,5h1v1h-1z M66,5h1v1h-1z M59,6h1v1h-1z M67,6h1v1h-1z M58,7h1v1h-1z M68,7h1v1h-1z M41,15h1v1h-1z M85,15h1v1h-1z M40,16h1v1h-1z M86,16h1v1h-1z M39,17h1v1h-1z M87,17h1v1h-1z M38,18h1v1h-1z M88,18h1v1h-1z M36,21h1v1h-1z M90,21h1v1h-1z M45,22h1v1h-1z M50,22h1v1h-1z M76,22h1v1h-1z M81,22h1v1h-1z M44,23h1v1h-1z M51,23h1v1h-1z M75,23h1v1h-1z M82,23h1v1h-1z M44,28h1v1h-1z M47,28h1v1h-1z M51,28h1v1h-1z M75,28h1v1h-1z M78,28h1v1h-1z M82,28h1v1h-1z M45,29h1v1h-1z M50,29h1v1h-1z M76,29h1v1h-1z M81,29h1v1h-1z M26,35h1v1h-1z M37,35h1v1h-1z M89,35h1v1h-1z M100,35h1v1h-1z M25,36h1v1h-1z M101,36h1v1h-1z M36,38h1v1h-1z M90,38h1v1h-1z M41,41h1v1h-1z M85,41h1v1h-1z M49,42h1v1h-1z M54,42h1v1h-1z M56,42h1v1h-1z M62,42h1v1h-1z M64,42h1v1h-1z M70,42h1v1h-1z M72,42h1v1h-1z M77,42h1v1h-1z M50,43h1v1h-1z M53,43h1v1h-1z M57,43h1v1h-1z M61,43h1v1h-1z M65,43h1v1h-1z M69,43h1v1h-1z M73,43h1v1h-1z M76,43h1v1h-1z M21,44h1v1h-1z M105,44h1v1h-1z M31,48h1v1h-1z M95,48h1v1h-1z M30,49h1v1h-1z M96,49h1v1h-1z M29,50h1v1h-1z M97,50h1v1h-1z M20,51h1v1h-1z M106,51h1v1h-1z M62,3h3v1h-3z M57,8h1v2h-1z M69,8h1v2h-1z M54,9h3v1h-3z M58,9h2v1h-2z M67,9h2v1h-2z M70,9h3v1h-3z M52,10h2v1h-2z M73,10h2v1h-2z M50,11h2v1h-2z M75,11h2v1h-2z M48,12h2v1h-2z M77,12h2v1h-2z M45,13h3v1h-3z M79,13h3v1h-3z M42,14h3v1h-3z M82,14h3v1h-3z M37,19h1v2h-1z M89,19h1v2h-1z M46,21h4v1h-4z M77,21h4v1h-4z M35,22h1v2h-1z M91,22h1v2h-1z M34,24h1v3h-1z M43,24h1v4h-1z M52,24h1v4h-1z M74,24h1v4h-1z M83,24h1v4h-1z M92,24h1v3h-1z M47,25h2v1h-2z M78,25h2v1h-2z M46,26h2v2h-2z M49,26h1v2h-1z M77,26h2v2h-2z M80,26h1v2h-1z M33,27h1v5h-1z M48,27h1v2h-1z M79,27h1v2h-1z M93,27h1v5h-1z M46,30h4v1h-4z M77,30h4v1h-4z M31,32h2v1h-2z M94,32h2v1h-2z M29,33h2v1h-2z M96,33h2v1h-2z M27,34h2v1h-2z M98,34h2v1h-2z M38,36h4v1h-4z M85,36h4v1h-4z M24,37h1v2h-1z M37,37h1v2h-1z M42,37h5v1h-5z M80,37h5v1h-5z M89,37h1v2h-1z M102,37h1v2h-1z M42,38h1v3h-1z M47,38h8v1h-8z M72,38h8v1h-8z M84,38h1v3h-1z M23,39h1v3h-1z M35,39h1v2h-1z M38,39h1v3h-1z M48,39h1v3h-1z M55,39h17v1h-17z M78,39h1v3h-1z M88,39h1v3h-1z M91,39h1v2h-1z M103,39h1v3h-1z M55,40h1v2h-1z M63,40h1v2h-1z M71,40h1v2h-1z M34,41h1v3h-1z M43,41h1v2h-1z M83,41h1v2h-1z M92,41h1v3h-1z M22,42h1v2h-1z M39,42h2v1h-2z M46,42h2v1h-2z M79,42h2v1h-2z M86,42h2v1h-2z M104,42h1v2h-1z M44,43h2v1h-2z M81,43h2v1h-2z M33,44h1v2h-1z M51,44h2v1h-2z M58,44h3v1h-3z M66,44h3v1h-3z M74,44h2v1h-2z M93,44h1v2h-1z M20,45h1v2h-1z M106,45h1v2h-1z M32,46h1v2h-1z M94,46h1v2h-1z M19,47h1v4h-1z M107,47h1v4h-1z M25,51h4v1h-4z M98,51h4v1h-4z M21,52h4v1h-4z M102,52h4v1h-4z"
          />
          <path
            fill="#85888B"
            d="M60,6h1v1h-1z M66,6h1v1h-1z M59,11h1v1h-1z M69,12h1v1h-1z M68,13h1v1h-1z M67,15h1v1h-1z M41,16h1v1h-1z M50,16h1v1h-1z M58,16h1v1h-1z M85,16h1v1h-1z M40,17h1v1h-1z M60,17h1v1h-1z M66,17h1v1h-1z M76,17h1v1h-1z M79,17h1v1h-1z M86,17h1v1h-1z M39,18h1v1h-1z M87,18h1v1h-1z M81,19h1v1h-1z M45,20h1v1h-1z M37,21h1v1h-1z M41,21h1v1h-1z M85,21h1v1h-1z M89,21h1v1h-1z M86,22h1v1h-1z M39,25h1v1h-1z M87,26h1v1h-1z M39,27h1v1h-1z M87,29h1v1h-1z M35,32h1v1h-1z M52,32h1v1h-1z M53,33h1v1h-1z M73,33h1v1h-1z M92,34h1v1h-1z M31,35h1v1h-1z M95,35h1v1h-1z M29,37h1v1h-1z M97,37h1v1h-1z M27,39h1v1h-1z M99,39h1v1h-1z M102,45h1v1h-1z M104,47h1v1h-1z M105,48h1v1h-1z M62,4h3v1h-3z M61,5h2v1h-2z M64,5h2v1h-2z M45,14h3v1h-3z M61,14h2v2h-2z M64,14h2v2h-2z M79,14h3v1h-3z M42,15h3v1h-3z M59,15h2v1h-2z M63,15h1v2h-1z M82,15h3v1h-3z M60,16h2v1h-2z M65,16h2v1h-2z M44,17h1v2h-1z M48,17h2v1h-2z M51,17h2v1h-2z M82,17h1v3h-1z M43,18h1v2h-1z M46,18h2v1h-2z M77,18h2v1h-2z M80,18h2v1h-2z M83,18h1v3h-1z M38,19h1v2h-1z M45,19h2v1h-2z M84,19h1v3h-1z M88,19h1v2h-1z M41,20h2v1h-2z M36,22h1v5h-1z M90,22h1v2h-1z M38,23h1v7h-1z M37,24h1v2h-1z M88,25h1v5h-1z M37,27h1v3h-1z M36,28h1v4h-1z M89,28h2v4h-2z M55,30h1v3h-1z M67,30h3v1h-3z M56,31h1v3h-1z M68,31h6v1h-6z M54,32h1v2h-1z M57,32h4v2h-4z M72,32h1v2h-1z M74,32h4v1h-4z M91,32h1v2h-1z M31,33h2v2h-2z M61,33h4v1h-4z M70,33h2v1h-2z M94,33h2v2h-2z M29,34h2v3h-2z M60,34h2v1h-2z M96,34h2v3h-2z M27,35h2v4h-2z M98,35h2v4h-2z M26,36h1v4h-1z M100,36h1v4h-1z M25,37h1v4h-1z M101,37h1v4h-1z M24,39h1v3h-1z M102,39h1v3h-1z M23,45h1v2h-1z M22,46h1v3h-1z M103,46h2v1h-2z"
          />
          <path
            fill="#717478"
            d="M60,14h1v1h-1z M45,18h1v1h-1z M46,20h1v1h-1z M45,21h1v1h-1z M82,22h1v1h-1z M87,25h1v1h-1z M37,26h1v1h-1z M39,26h1v1h-1z M36,27h1v1h-1z M75,31h1v1h-1z M73,32h1v1h-1z M87,34h1v1h-1z M74,36h1v1h-1z M92,36h1v1h-1z M28,44h1v1h-1z M98,44h1v1h-1z M103,45h1v1h-1z M27,47h1v1h-1z M99,47h1v1h-1z M63,5h1v10h-1z M61,6h2v2h-2z M64,6h2v2h-2z M62,8h1v6h-1z M64,8h1v6h-1z M60,9h2v5h-2z M65,9h2v5h-2z M54,10h6v1h-6z M67,10h6v2h-6z M52,11h7v5h-7z M73,11h2v8h-2z M50,12h2v4h-2z M59,12h1v3h-1z M67,12h2v1h-2z M70,12h3v8h-3z M75,12h2v5h-2z M48,13h2v4h-2z M67,13h1v2h-1z M69,13h1v17h-1z M77,13h2v5h-2z M66,14h1v2h-1z M68,14h1v16h-1z M45,15h3v3h-3z M79,15h3v2h-3z M42,16h3v1h-3z M51,16h7v1h-7z M59,16h1v16h-1z M62,16h1v17h-1z M64,16h1v17h-1z M67,16h1v14h-1z M82,16h3v1h-3z M41,17h3v1h-3z M50,17h1v5h-1z M53,17h6v2h-6z M61,17h1v16h-1z M63,17h1v16h-1z M65,17h1v20h-1z M75,17h1v6h-1z M80,17h2v1h-2z M83,17h3v1h-3z M40,18h3v2h-3z M48,18h2v3h-2z M51,18h2v1h-2z M60,18h1v14h-1z M66,18h1v19h-1z M76,18h1v4h-1z M79,18h1v3h-1z M84,18h3v1h-3z M39,19h1v6h-1z M44,19h1v4h-1z M47,19h1v2h-1z M51,19h1v4h-1z M54,19h5v1h-5z M77,19h2v2h-2z M80,19h1v2h-1z M85,19h3v2h-3z M40,20h1v15h-1z M43,20h1v4h-1z M52,20h1v4h-1z M55,20h4v2h-4z M70,20h2v2h-2z M74,20h1v4h-1z M81,20h2v2h-2z M38,21h1v2h-1z M42,21h1v14h-1z M53,21h1v12h-1z M73,21h1v10h-1z M83,21h1v3h-1z M86,21h3v1h-3z M37,22h1v2h-1z M41,22h1v13h-1z M54,22h1v10h-1z M56,22h3v9h-3z M70,22h1v9h-1z M72,22h1v9h-1z M84,22h2v13h-2z M87,22h3v3h-3z M86,23h1v12h-1z M35,24h1v8h-1z M55,24h1v6h-1z M71,24h1v7h-1z M90,24h2v4h-2z M89,25h1v3h-1z M34,27h1v10h-1z M87,27h1v2h-1z M92,27h1v7h-1z M39,28h1v7h-1z M43,28h1v7h-1z M83,28h1v7h-1z M91,28h1v4h-1z M44,29h1v6h-1z M82,29h1v6h-1z M37,30h2v4h-2z M45,30h1v5h-1z M52,30h1v2h-1z M74,30h1v2h-1z M81,30h1v5h-1z M87,30h2v4h-2z M46,31h1v5h-1z M51,31h1v5h-1z M57,31h2v1h-2z M67,31h1v6h-1z M80,31h1v5h-1z M33,32h1v6h-1z M36,32h1v3h-1z M47,32h4v4h-4z M68,32h4v1h-4z M78,32h2v4h-2z M89,32h2v2h-2z M93,32h1v6h-1z M35,33h1v3h-1z M52,33h1v4h-1z M55,33h1v4h-1z M68,33h2v4h-2z M74,33h4v3h-4z M53,34h2v3h-2z M56,34h4v3h-4z M62,34h3v3h-3z M70,34h4v3h-4z M90,34h2v1h-2z M32,35h1v4h-1z M60,35h2v2h-2z M91,35h2v1h-2z M94,35h1v4h-1z M31,36h1v4h-1z M95,36h1v4h-1z M30,37h1v5h-1z M96,37h1v5h-1z M29,38h1v4h-1z M97,38h1v4h-1z M28,39h1v4h-1z M98,39h1v4h-1z M26,40h2v6h-2z M99,40h2v6h-2z M25,41h1v9h-1z M101,41h1v9h-1z M23,42h2v3h-2z M102,42h2v3h-2z M22,44h1v2h-1z M104,44h1v2h-1z M21,45h1v7h-1z M24,45h1v5h-1z M105,45h1v3h-1z M26,46h1v3h-1z M100,46h1v3h-1z M102,46h1v4h-1z M20,47h1v4h-1z M23,47h1v4h-1z M103,47h1v4h-1z M106,47h1v4h-1z M104,48h1v4h-1z M22,49h1v3h-1z M105,49h1v3h-1z"
          />
          <path
            fill="#474C58"
            d="M58,8h1v1h-1z M61,8h1v1h-1z M65,8h1v1h-1z M68,8h1v1h-1z M54,21h1v1h-1z M72,21h1v1h-1z M37,36h1v1h-1z M89,36h1v1h-1z M28,43h1v1h-1z M98,43h1v1h-1z M27,46h1v1h-1z M99,46h1v1h-1z M29,49h1v1h-1z M97,49h1v1h-1z M59,7h2v2h-2z M66,7h2v2h-2z M52,19h2v1h-2z M73,19h2v1h-2z M53,20h2v1h-2z M72,20h2v1h-2z M55,22h1v2h-1z M71,22h1v2h-1z M52,28h1v2h-1z M74,28h1v2h-1z M51,29h1v2h-1z M75,29h1v2h-1z M50,30h1v2h-1z M76,30h1v2h-1z M47,31h3v1h-3z M77,31h3v1h-3z M37,34h2v1h-2z M88,34h2v1h-2z M36,35h1v3h-1z M38,35h8v1h-8z M81,35h8v1h-8z M90,35h1v3h-1z M35,36h1v3h-1z M42,36h10v1h-10z M75,36h10v1h-10z M91,36h1v3h-1z M34,37h1v4h-1z M47,37h33v1h-33z M92,37h1v4h-1z M33,38h1v6h-1z M55,38h17v1h-17z M93,38h1v6h-1z M32,39h1v7h-1z M94,39h1v7h-1z M31,40h1v8h-1z M95,40h1v8h-1z M29,42h2v7h-2z M96,42h2v7h-2z M28,45h1v6h-1z M98,45h1v6h-1z M27,48h1v3h-1z M99,48h1v3h-1z M26,49h1v2h-1z M100,49h1v2h-1z M24,50h2v1h-2z M101,50h2v1h-2z M23,51h2v1h-2z M102,51h2v1h-2z"
          />
          <path
            fill="#BED2E9"
            d="M49,40h1v1h-1z M54,40h1v1h-1z M72,40h1v1h-1z M77,40h1v1h-1z M56,41h1v1h-1z M62,41h1v1h-1z M64,41h1v1h-1z M70,41h1v1h-1z M46,22h4v2h-4z M77,22h4v2h-4z M45,23h1v2h-1z M50,23h1v2h-1z M76,23h1v2h-1z M81,23h1v2h-1z M44,24h1v4h-1z M51,24h1v4h-1z M75,24h1v4h-1z M82,24h1v4h-1z M38,37h4v1h-4z M85,37h4v1h-4z M38,38h2v1h-2z M43,38h4v1h-4z M80,38h4v1h-4z M87,38h2v1h-2z M45,39h3v1h-3z M49,39h6v1h-6z M72,39h6v1h-6z M79,39h3v1h-3z M56,40h7v1h-7z M64,40h7v1h-7z"
          />
          <path
            fill="#E9F1F6"
            d="M48,26h1v1h-1z M79,26h1v1h-1z M40,41h1v1h-1z M49,41h1v1h-1z M54,41h1v1h-1z M72,41h1v1h-1z M77,41h1v1h-1z M86,41h1v1h-1z M45,42h1v1h-1z M81,42h1v1h-1z M46,24h4v1h-4z M77,24h4v1h-4z M45,25h2v1h-2z M49,25h2v1h-2z M76,25h2v1h-2z M80,25h2v1h-2z M45,26h1v3h-1z M50,26h1v3h-1z M76,26h1v3h-1z M81,26h1v3h-1z M46,28h1v2h-1z M49,28h1v2h-1z M77,28h1v2h-1z M80,28h1v2h-1z M47,29h2v1h-2z M78,29h2v1h-2z M40,38h2v3h-2z M85,38h2v3h-2z M39,39h1v3h-1z M43,39h2v2h-2z M82,39h2v2h-2z M87,39h1v3h-1z M45,40h3v2h-3z M50,40h4v3h-4z M73,40h4v3h-4z M79,40h3v2h-3z M44,41h1v2h-1z M57,41h5v2h-5z M65,41h5v2h-5z M82,41h1v2h-1z M51,43h2v1h-2z M58,43h3v1h-3z M66,43h3v1h-3z M74,43h2v1h-2z"
          />
        </g>
      );
    case 16: // unicorn
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M48,10h1v1h-1z M78,10h1v1h-1z M49,11h1v1h-1z M77,11h1v1h-1z M45,15h1v1h-1z M81,15h1v1h-1z M46,16h1v1h-1z M80,16h1v1h-1z M47,17h1v1h-1z M79,17h1v1h-1z M45,19h1v1h-1z M81,19h1v1h-1z M46,20h1v1h-1z M80,20h1v1h-1z M63,3h1v2h-1z M62,5h1v2h-1z M64,5h1v2h-1z M61,7h1v2h-1z M65,7h1v2h-1z M45,9h3v1h-3z M60,9h1v2h-1z M66,9h1v2h-1z M79,9h3v1h-3z M44,10h1v5h-1z M82,10h1v5h-1z M59,11h1v2h-1z M67,11h1v2h-1z M50,12h2v1h-2z M75,12h2v1h-2z M52,13h2v1h-2z M58,13h1v2h-1z M68,13h1v2h-1z M73,13h2v1h-2z M54,14h3v1h-3z M70,14h3v1h-3z M57,15h1v2h-1z M69,15h1v2h-1z M44,16h1v3h-1z M82,16h1v3h-1z M56,17h1v2h-1z M70,17h1v2h-1z M55,19h1v2h-1z M71,19h1v2h-1z M47,21h4v1h-4z M54,21h1v2h-1z M72,21h1v2h-1z M76,21h4v1h-4z M51,22h3v1h-3z M73,22h3v1h-3z M53,23h1v2h-1z M73,23h1v2h-1z M54,25h2v1h-2z M71,25h2v1h-2z M56,26h3v1h-3z M68,26h3v1h-3z M59,27h9v1h-9z"
          />
          <path
            fill="#A53AC5"
            d="M66,17h1v1h-1z M63,19h1v1h-1z M58,20h1v1h-1z M69,24h1v1h-1z M63,5h1v5h-1z M62,7h1v4h-1z M65,14h1v5h-1z M63,15h2v4h-2z M60,16h3v4h-3z M59,18h1v3h-1z M68,23h1v2h-1z M66,24h2v2h-2z M64,25h2v1h-2z"
          />
          <path
            fill="#D44CCF"
            d="M60,11h1v1h-1z M67,17h1v1h-1z M57,20h1v1h-1z M69,23h1v1h-1z M64,7h1v2h-1z M61,9h1v3h-1z M66,13h2v4h-2z M68,15h1v2h-1z M57,17h3v1h-3z M57,18h2v2h-2z M56,19h1v2h-1z M71,21h1v4h-1z M70,22h1v4h-1z M72,23h1v2h-1z M68,25h2v1h-2z M59,26h9v1h-9z"
          />
          <path
            fill="#48B0EC"
            d="M67,18h1v1h-1z M55,24h1v1h-1z M64,9h2v1h-2z M65,10h1v2h-1z M66,11h1v2h-1z M60,12h1v2h-1z M59,13h1v4h-1z M58,15h1v2h-1z M68,17h2v4h-2z M70,19h1v3h-1z M55,21h3v1h-3z M69,21h1v2h-1z M55,22h2v2h-2z M54,23h1v2h-1z M56,25h3v1h-3z"
          />
          <path
            fill="#DAE2F5"
            d="M47,14h1v1h-1z M79,14h1v1h-1z M45,10h3v2h-3z M79,10h3v2h-3z M48,11h1v5h-1z M78,11h1v5h-1z M46,12h2v2h-2z M49,12h1v5h-1z M77,12h1v5h-1z M79,12h2v2h-2z M50,13h2v5h-2z M75,13h2v5h-2z M52,14h2v5h-2z M73,14h2v5h-2z M54,15h3v2h-3z M70,15h3v2h-3z M45,17h1v2h-1z M54,17h2v2h-2z M71,17h2v2h-2z M81,17h1v2h-1z M46,18h1v2h-1z M80,18h1v2h-1z M47,19h2v2h-2z M54,19h1v2h-1z M72,19h1v2h-1z M78,19h2v2h-2z M49,20h5v1h-5z M73,20h5v1h-5z M51,21h3v1h-3z M73,21h3v1h-3z"
          />
          <path
            fill="#3C81EC"
            d="M56,24h1v1h-1z M59,25h1v1h-1z M63,10h2v5h-2z M62,11h1v5h-1z M61,12h1v4h-1z M65,12h1v2h-1z M60,14h1v2h-1z M66,18h1v6h-1z M64,19h2v6h-2z M67,19h1v5h-1z M60,20h4v6h-4z M58,21h2v4h-2z M68,21h1v2h-1z M57,22h1v3h-1z"
          />
          <path
            fill="#EAB3EA"
            d="M45,16h1v1h-1z M81,16h1v1h-1z M46,17h1v1h-1z M80,17h1v1h-1z M47,18h1v1h-1z M79,18h1v1h-1z M45,12h1v3h-1z M81,12h1v3h-1z M46,14h1v2h-1z M80,14h1v2h-1z M47,15h1v2h-1z M79,15h1v2h-1z M48,16h1v3h-1z M78,16h1v3h-1z M49,17h1v3h-1z M77,17h1v3h-1z M50,18h2v2h-2z M75,18h2v2h-2z M52,19h2v1h-2z M73,19h2v1h-2z"
          />
        </g>
      );
    case 17: // wizard
      return (
        <g className='gotchipus-heads'>
          <path
            fill="#151516"
            d="M62,5h1v1h-1z M61,6h1v1h-1z M85,6h1v1h-1z M86,7h1v1h-1z M87,8h1v1h-1z M54,9h1v1h-1z M51,14h1v1h-1z M82,14h1v1h-1z M78,15h1v1h-1z M83,15h1v1h-1z M84,16h1v1h-1z M49,17h1v1h-1z M85,17h1v1h-1z M57,18h1v1h-1z M55,22h1v1h-1z M57,22h1v1h-1z M39,23h1v1h-1z M61,23h1v1h-1z M36,25h1v1h-1z M91,25h1v1h-1z M92,26h1v1h-1z M35,31h1v1h-1z M93,31h1v1h-1z M69,2h6v1h-6z M65,3h4v1h-4z M75,3h4v1h-4z M63,4h2v1h-2z M79,4h3v1h-3z M82,5h3v1h-3z M59,7h2v1h-2z M55,8h4v1h-4z M88,9h1v4h-1z M53,10h1v2h-1z M52,12h1v2h-1z M73,13h2v1h-2z M80,13h2v1h-2z M89,13h1v2h-1z M75,14h5v1h-5z M50,15h1v2h-1z M56,15h5v1h-5z M90,15h1v4h-1z M51,16h5v1h-5z M61,16h3v1h-3z M79,16h1v4h-1z M55,17h1v2h-1z M57,17h4v1h-4z M63,17h6v1h-6z M48,18h1v4h-1z M61,18h1v2h-1z M63,18h1v2h-1z M69,18h5v1h-5z M86,18h2v1h-2z M54,19h1v4h-1z M56,19h1v4h-1z M59,19h2v1h-2z M74,19h2v1h-2z M88,19h2v1h-2z M58,20h1v3h-1z M60,20h1v4h-1z M62,20h1v4h-1z M76,20h3v1h-3z M42,21h6v1h-6z M49,21h3v1h-3z M59,21h1v2h-1z M78,21h1v5h-1z M40,22h2v1h-2z M52,22h2v1h-2z M79,22h5v1h-5z M63,23h4v1h-4z M84,23h5v1h-5z M37,24h2v1h-2z M67,24h7v1h-7z M89,24h2v1h-2z M74,25h4v1h-4z M35,26h1v2h-1z M93,27h1v2h-1z M34,28h1v3h-1z M55,29h8v1h-8z M94,29h1v2h-1z M45,30h10v1h-10z M63,30h6v1h-6z M40,31h5v1h-5z M69,31h5v1h-5z M36,32h4v1h-4z M74,32h5v1h-5z M88,32h5v1h-5z M79,33h9v1h-9z"
          />
          <path
            fill="#1E46BE"
            d="M69,6h1v1h-1z M82,7h1v1h-1z M78,9h1v1h-1z M59,11h1v1h-1z M81,11h1v1h-1z M75,13h1v1h-1z M78,13h1v1h-1z M60,14h1v1h-1z M51,15h1v1h-1z M55,15h1v1h-1z M86,15h1v1h-1z M74,18h1v1h-1z M58,26h1v1h-1z M35,28h1v1h-1z M46,28h1v1h-1z M39,29h1v1h-1z M93,29h1v1h-1z M85,30h1v1h-1z M69,3h6v3h-6z M65,4h4v4h-4z M75,4h4v2h-4z M63,5h2v5h-2z M79,5h3v6h-3z M62,6h1v3h-1z M71,6h4v1h-4z M76,6h3v3h-3z M82,6h3v1h-3z M61,7h1v2h-1z M72,7h4v1h-4z M84,7h2v1h-2z M65,8h3v2h-3z M73,8h3v5h-3z M85,8h2v7h-2z M55,9h4v6h-4z M68,9h1v8h-1z M72,9h1v9h-1z M76,9h1v5h-1z M82,9h1v3h-1z M84,9h1v5h-1z M87,9h1v8h-1z M54,10h1v6h-1z M59,10h4v1h-4z M66,10h2v1h-2z M70,10h1v5h-1z M83,10h1v3h-1z M61,11h5v1h-5z M67,11h1v6h-1z M69,11h1v7h-1z M71,11h1v7h-1z M53,12h1v4h-1z M62,12h5v4h-5z M77,12h1v2h-1z M59,13h1v2h-1z M61,13h1v3h-1z M88,13h1v6h-1z M52,14h1v2h-1z M73,15h2v3h-2z M89,15h1v4h-1z M64,16h3v1h-3z M70,16h1v2h-1z M75,16h1v3h-1z M76,17h1v3h-1z M77,18h2v2h-2z M42,22h6v2h-6z M40,23h2v6h-2z M48,23h1v5h-1z M50,23h2v5h-2z M80,23h4v1h-4z M39,24h1v4h-1z M42,24h2v1h-2z M45,24h3v1h-3z M49,24h1v4h-1z M52,24h8v1h-8z M81,24h8v1h-8z M37,25h2v5h-2z M42,25h1v4h-1z M46,25h2v3h-2z M52,25h6v2h-6z M59,25h8v2h-8z M81,25h1v6h-1z M83,25h8v2h-8z M36,26h1v4h-1z M43,26h1v3h-1z M45,26h1v3h-1z M67,26h7v2h-7z M80,26h1v5h-1z M82,26h1v5h-1z M91,26h1v4h-1z M44,27h1v2h-1z M52,27h4v1h-4z M62,27h4v1h-4z M74,27h6v2h-6z M83,27h2v1h-2z M86,27h5v1h-5z M92,27h1v3h-1z M69,28h5v1h-5z M83,28h1v3h-1z M87,28h4v3h-4z M74,29h4v1h-4z M79,29h1v2h-1z M84,29h1v2h-1z M86,29h1v2h-1z"
          />
          <path
            fill="#E9C416"
            d="M75,6h1v1h-1z M68,8h1v1h-1z M72,8h1v1h-1z M82,8h1v1h-1z M84,8h1v1h-1z M59,12h1v1h-1z M61,12h1v1h-1z M70,15h1v1h-1z M49,23h1v1h-1z M43,25h1v1h-1z M45,25h1v1h-1z M58,25h1v1h-1z M82,25h1v1h-1z M66,27h1v1h-1z M39,28h1v1h-1z M84,28h1v1h-1z M86,28h1v1h-1z M78,29h1v1h-1z M70,6h1v4h-1z M69,7h1v4h-1z M71,7h1v4h-1z M83,7h1v3h-1z M60,11h1v3h-1z M44,24h1v3h-1z M85,27h1v3h-1z"
          />
          <path
            fill="#252293"
            d="M66,11h1v1h-1z M79,13h1v1h-1z M59,8h2v2h-2z M61,9h2v1h-2z M77,9h1v3h-1z M63,10h3v1h-3z M78,10h1v3h-1z M79,11h2v2h-2z M81,12h2v1h-2z M82,13h2v1h-2z M73,14h2v1h-2z M83,14h2v1h-2z M75,15h3v1h-3z M84,15h2v1h-2z M76,16h3v1h-3z M85,16h2v1h-2z M77,17h2v1h-2z M86,17h2v1h-2z M48,22h4v1h-4z M52,23h8v1h-8z M79,23h1v4h-1z M60,24h7v1h-7z M80,24h1v2h-1z M67,25h7v1h-7z M74,26h5v1h-5z M56,27h6v2h-6z M47,28h9v1h-9z M62,28h7v1h-7z M35,29h1v2h-1z M40,29h15v1h-15z M63,29h11v1h-11z M36,30h9v1h-9z M69,30h10v1h-10z M91,30h3v1h-3z M36,31h4v1h-4z M74,31h19v1h-19z M79,32h9v1h-9z"
          />
          <path
            fill="#DADAE9"
            d="M56,17h1v1h-1z M55,19h1v1h-1z M59,20h1v1h-1z M56,16h2v1h-2z M62,17h1v2h-1z"
          />
          <path
            fill="#90909D"
            d="M61,17h1v1h-1z M56,18h1v1h-1z M62,19h1v1h-1z M58,16h3v1h-3z M55,20h1v2h-1z M61,20h1v3h-1z"
          />
          <path
            fill="#A98147"
            d="M51,20h1v1h-1z M71,21h1v1h-1z M50,17h3v1h-3z M49,18h2v3h-2z M66,18h3v5h-3z M69,19h1v5h-1z M70,20h1v3h-1z M65,21h1v2h-1z M76,21h2v4h-2z M67,23h2v1h-2z M75,23h1v2h-1z"
          />
          <path
            fill="#84562D"
            d="M71,23h1v1h-1z M74,24h1v1h-1z M53,17h2v2h-2z M58,18h3v1h-3z M64,18h2v3h-2z M53,19h1v3h-1z M57,19h2v1h-2z M71,19h3v1h-3z M52,20h1v2h-1z M57,20h1v2h-1z M63,20h1v3h-1z M72,20h4v1h-4z M64,21h1v2h-1z M73,21h3v2h-3z M72,22h1v2h-1z M73,23h2v1h-2z"
          />
          <path
            fill="#62321E"
            d="M70,19h1v1h-1z M71,20h1v1h-1z M72,21h1v1h-1z M71,22h1v1h-1z M70,23h1v1h-1z M51,18h2v2h-2z"
          />
        </g>
      );
  }

};

export default heads;