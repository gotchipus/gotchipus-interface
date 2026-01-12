import React from 'react';

const eyes = (index: number) => {
  switch (index) {
    case 1: // bitcoin eye
      return (
        <g className="gotchipus-eye">
          <path
            fill="#151516"
            d="M45,65h1v1h-1z M71,65h1v1h-1z M53,66h1v1h-1z M79,66h1v1h-1z M48,49h5v3h-5z M74,49h5v3h-5z M46,50h2v4h-2z M53,50h2v2h-2z M72,50h2v4h-2z M79,50h2v2h-2z M45,51h1v3h-1z M55,51h1v4h-1z M71,51h1v3h-1z M81,51h1v4h-1z M44,52h1v13h-1z M50,52h2v2h-2z M54,52h1v2h-1z M56,52h1v13h-1z M70,52h1v13h-1z M76,52h2v2h-2z M80,52h1v2h-1z M82,52h1v13h-1z M43,53h1v11h-1z M57,53h1v11h-1z M69,53h1v11h-1z M83,53h1v11h-1z M42,55h1v7h-1z M58,55h1v7h-1z M68,55h1v7h-1z M84,55h1v7h-1z M45,56h1v6h-1z M50,56h4v2h-4z M71,56h1v6h-1z M76,56h4v2h-4z M46,57h1v4h-1z M72,57h1v4h-1z M55,58h1v2h-1z M81,58h1v2h-1z M50,60h4v2h-4z M76,60h4v2h-4z M55,63h1v3h-1z M81,63h1v3h-1z M46,64h2v1h-2z M50,64h2v2h-2z M54,64h1v3h-1z M72,64h2v1h-2z M76,64h2v2h-2z M80,64h1v3h-1z M46,66h2v1h-2z M72,66h2v1h-2z M48,67h5v1h-5z M74,67h5v1h-5z"
          />
          <path
            fill="#F7941D"
            d="M52,55h1v1h-1z M78,55h1v1h-1z M45,63h1v1h-1z M71,63h1v1h-1z M48,52h1v14h-1z M52,52h1v2h-1z M74,52h1v14h-1z M78,52h1v2h-1z M45,54h3v1h-3z M49,54h3v2h-3z M71,54h3v1h-3z M75,54h3v2h-3z M46,55h2v1h-2z M54,55h1v3h-1z M72,55h2v1h-2z M80,55h1v3h-1z M47,56h1v8h-1z M73,56h1v8h-1z M49,58h5v2h-5z M75,58h5v2h-5z M54,60h1v3h-1z M80,60h1v3h-1z M46,62h1v2h-1z M49,62h5v2h-5z M72,62h1v2h-1z M75,62h5v2h-5z M52,64h1v2h-1z M78,64h1v2h-1z"
          />
          <path
            fill="#FAD348"
            d="M52,54h1v1h-1z M54,54h1v1h-1z M78,54h1v1h-1z M80,54h1v1h-1z M45,55h1v1h-1z M71,55h1v1h-1z M46,56h1v1h-1z M72,56h1v1h-1z M46,61h1v1h-1z M72,61h1v1h-1z M45,62h1v1h-1z M71,62h1v1h-1z M54,63h1v1h-1z M80,63h1v1h-1z M49,52h1v2h-1z M53,52h1v4h-1z M75,52h1v2h-1z M79,52h1v4h-1z M55,55h1v3h-1z M81,55h1v3h-1z M49,56h1v2h-1z M75,56h1v2h-1z M54,58h1v2h-1z M80,58h1v2h-1z M49,60h1v2h-1z M55,60h1v3h-1z M75,60h1v2h-1z M81,60h1v3h-1z M49,64h1v2h-1z M53,64h1v2h-1z M75,64h1v2h-1z M79,64h1v2h-1z"
          />
          <path
            fill="#19476E"
            d="M45,64h1v1h-1z M71,64h1v1h-1z M46,65h2v1h-2z M72,65h2v1h-2z M48,66h5v1h-5z M74,66h5v1h-5z"
          />
        </g>
      )
    
    case 2: // curved smiling
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M48,53h5v3h-5z M74,53h5v3h-5z M46,54h2v3h-2z M53,54h2v3h-2z M72,54h2v3h-2z M79,54h2v3h-2z M44,55h2v3h-2z M55,55h2v3h-2z M70,55h2v3h-2z M81,55h2v3h-2z M43,56h1v3h-1z M57,56h1v3h-1z M69,56h1v3h-1z M83,56h1v3h-1z M42,58h1v2h-1z M58,58h1v2h-1z M68,58h1v2h-1z M84,58h1v2h-1z"
          />
        </g>
      )

    case 3: // dogecoin eye
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M45,51h1v1h-1z M55,51h1v1h-1z M71,51h1v1h-1z M81,51h1v1h-1z M44,52h1v1h-1z M56,52h1v1h-1z M70,52h1v1h-1z M82,52h1v1h-1z M44,64h1v1h-1z M56,64h1v1h-1z M70,64h1v1h-1z M82,64h1v1h-1z M45,65h1v1h-1z M55,65h1v1h-1z M71,65h1v1h-1z M81,65h1v1h-1z M48,49h5v1h-5z M74,49h5v1h-5z M46,50h2v1h-2z M53,50h2v1h-2z M72,50h2v1h-2z M79,50h2v1h-2z M43,53h1v2h-1z M57,53h1v2h-1z M69,53h1v2h-1z M83,53h1v2h-1z M42,55h1v7h-1z M58,55h1v7h-1z M68,55h1v7h-1z M84,55h1v7h-1z M43,62h1v2h-1z M57,62h1v2h-1z M69,62h1v2h-1z M83,62h1v2h-1z M46,66h2v1h-2z M53,66h2v1h-2z M72,66h2v1h-2z M79,66h2v1h-2z M48,67h5v1h-5z M74,67h5v1h-5z"
          />
          <path
            fill="#B89B15"
            d="M45,52h1v1h-1z M71,52h1v1h-1z M54,53h1v1h-1z M80,53h1v1h-1z M48,50h5v1h-5z M74,50h5v1h-5z M46,51h5v2h-5z M53,51h2v2h-2z M72,51h5v2h-5z M79,51h2v2h-2z M55,52h1v3h-1z M81,52h1v3h-1z M44,53h1v9h-1z M56,53h1v3h-1z M70,53h1v9h-1z M82,53h1v3h-1z M43,55h1v4h-1z M57,55h1v7h-1z M69,55h1v4h-1z M83,55h1v7h-1z M45,56h2v5h-2z M50,56h2v5h-2z M71,56h2v5h-2z M76,56h2v5h-2z M52,57h1v3h-1z M78,57h1v3h-1z M56,61h1v3h-1z M82,61h1v3h-1z M55,62h1v2h-1z M81,62h1v2h-1z M54,63h1v2h-1z M80,63h1v2h-1z M47,64h7v1h-7z M73,64h7v1h-7z M50,65h3v1h-3z M76,65h3v1h-3z"
          />
          <path
            fill="#E4D93D"
            d="M55,64h1v1h-1z M81,64h1v1h-1z M51,51h2v2h-2z M77,51h2v2h-2z M43,59h1v3h-1z M69,59h1v3h-1z M44,62h1v2h-1z M70,62h1v2h-1z M45,64h2v1h-2z M71,64h2v1h-2z M46,65h4v1h-4z M53,65h2v1h-2z M72,65h4v1h-4z M79,65h2v1h-2z M48,66h5v1h-5z M74,66h5v1h-5z"
          />
          <path
            fill="#FFFFFF"
            d="M45,53h9v3h-9z M71,53h9v3h-9z M54,54h1v9h-1z M80,54h1v9h-1z M55,55h1v7h-1z M81,55h1v7h-1z M47,56h3v8h-3z M52,56h2v1h-2z M56,56h1v5h-1z M73,56h3v8h-3z M78,56h2v1h-2z M82,56h1v5h-1z M53,57h1v7h-1z M79,57h1v7h-1z M52,60h1v4h-1z M78,60h1v4h-1z M45,61h2v3h-2z M50,61h2v3h-2z M71,61h2v3h-2z M76,61h2v3h-2z"
          />
        </g>
      )

    case 4: // dollar
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M46,52h1v1h-1z M72,52h1v1h-1z M48,61h1v1h-1z M74,61h1v1h-1z M45,63h1v1h-1z M54,63h1v1h-1z M71,63h1v1h-1z M80,63h1v1h-1z M44,64h1v1h-1z M56,64h1v1h-1z M70,64h1v1h-1z M82,64h1v1h-1z M45,65h1v1h-1z M55,65h1v1h-1z M71,65h1v1h-1z M81,65h1v1h-1z M48,49h5v1h-5z M74,49h5v1h-5z M46,50h3v2h-3z M52,50h3v2h-3z M72,50h3v2h-3z M78,50h3v2h-3z M45,51h1v3h-1z M55,51h1v2h-1z M71,51h1v3h-1z M81,51h1v2h-1z M44,52h1v11h-1z M56,52h1v3h-1z M70,52h1v11h-1z M82,52h1v3h-1z M43,53h1v11h-1z M57,53h1v3h-1z M69,53h1v11h-1z M83,53h1v3h-1z M48,54h1v2h-1z M52,54h1v3h-1z M74,54h1v2h-1z M78,54h1v3h-1z M42,55h1v7h-1z M53,55h3v1h-3z M58,55h1v7h-1z M68,55h1v7h-1z M79,55h3v1h-3z M84,55h1v7h-1z M53,56h2v1h-2z M79,56h2v1h-2z M45,57h1v4h-1z M54,57h2v1h-2z M57,57h1v7h-1z M71,57h1v4h-1z M80,57h2v1h-2z M83,57h1v7h-1z M46,58h1v3h-1z M55,58h2v1h-2z M72,58h1v3h-1z M81,58h2v1h-2z M47,59h2v2h-2z M56,59h1v4h-1z M73,59h2v2h-2z M82,59h1v4h-1z M52,60h1v2h-1z M78,60h1v2h-1z M55,62h1v2h-1z M81,62h1v2h-1z M47,64h2v1h-2z M52,64h2v1h-2z M73,64h2v1h-2z M78,64h2v1h-2z M46,66h2v1h-2z M53,66h2v1h-2z M72,66h2v1h-2z M79,66h2v1h-2z M48,67h5v1h-5z M74,67h5v1h-5z"
          />
          <path
            fill="#F6B635"
            d="M49,50h2v16h-2z M75,50h2v16h-2z M47,52h2v2h-2z M51,52h1v2h-1z M73,52h2v2h-2z M77,52h1v2h-1z M46,53h1v5h-1z M52,53h3v1h-3z M72,53h1v5h-1z M78,53h3v1h-3z M45,54h1v3h-1z M53,54h3v1h-3z M71,54h1v3h-1z M79,54h3v1h-3z M47,56h1v3h-1z M73,56h1v3h-1z M48,57h1v2h-1z M51,57h1v2h-1z M74,57h1v2h-1z M77,57h1v2h-1z M52,58h2v2h-2z M78,58h2v2h-2z M54,59h1v4h-1z M80,59h1v4h-1z M53,60h1v4h-1z M79,60h1v4h-1z M45,61h1v2h-1z M71,61h1v2h-1z M46,62h3v2h-3z M51,62h2v2h-2z M72,62h3v2h-3z M77,62h2v2h-2z"
          />
          <path
            fill="#F8E466"
            d="M55,53h1v1h-1z M81,53h1v1h-1z M48,56h1v1h-1z M74,56h1v1h-1z M54,58h1v1h-1z M80,58h1v1h-1z M51,50h1v2h-1z M77,50h1v2h-1z M52,52h3v1h-3z M78,52h3v1h-3z M47,54h1v2h-1z M51,54h1v3h-1z M73,54h1v2h-1z M77,54h1v3h-1z M52,57h2v1h-2z M78,57h2v1h-2z M51,59h1v3h-1z M55,59h1v3h-1z M77,59h1v3h-1z M81,59h1v3h-1z M46,61h2v1h-2z M72,61h2v1h-2z M51,64h1v2h-1z M77,64h1v2h-1z"
          />
          <path
            fill="#FFFFFF"
            d="M55,56h1v1h-1z M57,56h1v1h-1z M81,56h1v1h-1z M83,56h1v1h-1z M56,55h1v3h-1z M82,55h1v3h-1z"
          />
          <path
            fill="#62DCDC"
            d="M44,63h1v1h-1z M56,63h1v1h-1z M70,63h1v1h-1z M82,63h1v1h-1z M45,64h2v1h-2z M54,64h2v1h-2z M71,64h2v1h-2z M80,64h2v1h-2z M46,65h3v1h-3z M52,65h3v1h-3z M72,65h3v1h-3z M78,65h3v1h-3z M48,66h5v1h-5z M74,66h5v1h-5z"
          />
        </g>
      )

    case 5: // normal
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M54,53h1v1h-1z M80,53h1v1h-1z M44,64h1v1h-1z M56,64h1v1h-1z M70,64h1v1h-1z M82,64h1v1h-1z M45,65h1v1h-1z M55,65h1v1h-1z M71,65h1v1h-1z M81,65h1v1h-1z M48,49h5v4h-5z M74,49h5v4h-5z M46,50h2v11h-2z M53,50h2v3h-2z M72,50h2v11h-2z M79,50h2v3h-2z M45,51h1v12h-1z M55,51h1v13h-1z M71,51h1v13h-1z M81,51h1v12h-1z M44,52h1v10h-1z M56,52h1v11h-1z M70,52h1v11h-1z M82,52h1v10h-1z M43,53h1v11h-1z M48,53h3v1h-3z M57,53h1v11h-1z M69,53h1v11h-1z M74,53h3v1h-3z M83,53h1v11h-1z M48,54h2v7h-2z M74,54h2v7h-2z M42,55h1v7h-1z M58,55h1v7h-1z M68,55h1v7h-1z M84,55h1v7h-1z M50,57h1v8h-1z M54,57h1v7h-1z M76,57h1v8h-1z M80,57h1v7h-1z M51,58h3v6h-3z M77,58h3v6h-3z M46,61h1v3h-1z M49,61h1v2h-1z M72,61h1v3h-1z M75,61h1v2h-1z M47,63h2v1h-2z M73,63h2v1h-2z M48,64h2v1h-2z M51,64h2v1h-2z M74,64h2v1h-2z M77,64h2v1h-2z M46,66h2v1h-2z M53,66h2v1h-2z M72,66h2v1h-2z M79,66h2v1h-2z M48,67h5v1h-5z M74,67h5v1h-5z"
          />
          <path
            fill="#FFFFFF"
            d="M51,53h3v5h-3z M77,53h3v5h-3z M50,54h1v3h-1z M54,54h1v3h-1z M76,54h1v3h-1z M80,54h1v3h-1z"
          />
          <path
            fill="#552982"
            d="M49,63h1v1h-1z M75,63h1v1h-1z M47,61h2v2h-2z M73,61h2v2h-2z"
          />
          <path
            fill="#19476E"
            d="M56,63h1v1h-1z M70,63h1v1h-1z M44,62h1v2h-1z M82,62h1v2h-1z M45,63h1v2h-1z M81,63h1v2h-1z M46,64h2v2h-2z M53,64h3v1h-3z M71,64h3v1h-3z M79,64h2v2h-2z M48,65h7v1h-7z M72,65h7v1h-7z M48,66h5v1h-5z M74,66h5v1h-5z"
          />
        </g>
      )

    case 6: // pharos
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M51,53h1v1h-1z M77,53h1v1h-1z M47,62h1v1h-1z M73,62h1v1h-1z M53,63h1v1h-1z M79,63h1v1h-1z M44,64h1v1h-1z M56,64h1v1h-1z M70,64h1v1h-1z M82,64h1v1h-1z M45,65h1v1h-1z M55,65h1v1h-1z M71,65h1v1h-1z M81,65h1v1h-1z M48,49h5v2h-5z M74,49h5v2h-5z M46,50h2v7h-2z M53,50h2v4h-2z M72,50h2v7h-2z M79,50h2v4h-2z M45,51h1v12h-1z M48,51h2v1h-2z M52,51h1v4h-1z M55,51h1v3h-1z M71,51h1v12h-1z M74,51h2v1h-2z M78,51h1v4h-1z M81,51h1v3h-1z M44,52h1v10h-1z M56,52h1v11h-1z M70,52h1v10h-1z M82,52h1v11h-1z M43,53h1v11h-1z M57,53h1v11h-1z M69,53h1v11h-1z M83,53h1v11h-1z M53,54h1v6h-1z M79,54h1v6h-1z M42,55h1v7h-1z M48,55h1v2h-1z M58,55h1v7h-1z M68,55h1v7h-1z M74,55h1v2h-1z M84,55h1v7h-1z M54,56h2v8h-2z M80,56h2v8h-2z M46,57h1v6h-1z M72,57h1v6h-1z M51,58h2v2h-2z M77,58h2v2h-2z M47,61h2v1h-2z M73,61h2v1h-2z M51,64h2v1h-2z M77,64h2v1h-2z M46,66h2v1h-2z M53,66h2v1h-2z M72,66h2v1h-2z M79,66h2v1h-2z M48,67h5v1h-5z M74,67h5v1h-5z"
          />
          <path
            fill="#FFFFFF"
            d="M52,63h1v1h-1z M78,63h1v1h-1z M45,64h1v1h-1z M50,64h1v1h-1z M71,64h1v1h-1z M76,64h1v1h-1z M48,65h1v1h-1z M74,65h1v1h-1z M50,51h2v2h-2z M76,51h2v2h-2z M48,52h2v2h-2z M74,52h2v2h-2z M51,55h2v3h-2z M77,55h2v3h-2z M49,56h2v3h-2z M75,56h2v3h-2z M47,57h2v3h-2z M73,57h2v3h-2z M52,60h2v3h-2z M78,60h2v3h-2z M50,61h2v3h-2z M76,61h2v3h-2z M48,62h2v3h-2z M74,62h2v3h-2z M46,63h2v3h-2z M72,63h2v3h-2z"
          />
          <path
            fill="#A0A0A0"
            d="M50,53h1v1h-1z M76,53h1v1h-1z M48,54h2v1h-2z M74,54h2v1h-2z M49,59h2v1h-2z M75,59h2v1h-2z M47,60h2v1h-2z M73,60h2v1h-2z"
          />
          <path
            fill="#727272"
            d="M49,61h1v1h-1z M75,61h1v1h-1z M50,54h2v1h-2z M76,54h2v1h-2z M49,55h2v1h-2z M75,55h2v1h-2z M49,60h3v1h-3z M75,60h3v1h-3z"
          />
          <path fill="#2E89B1" d="M54,54h2v2h-2z M80,54h2v2h-2z" />
          <path
            fill="#19476E"
            d="M45,63h1v1h-1z M56,63h1v1h-1z M71,63h1v1h-1z M82,63h1v1h-1z M44,62h1v2h-1z M70,62h1v2h-1z M53,64h3v1h-3z M79,64h3v1h-3z M49,65h6v1h-6z M75,65h6v1h-6z M48,66h5v1h-5z M74,66h5v1h-5z"
          />
        </g>
      )

    case 7: // single
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#151516"
            d="M54,53h1v1h-1z M44,64h1v1h-1z M56,64h1v1h-1z M45,65h1v1h-1z M55,65h1v1h-1z M48,49h5v4h-5z M46,50h2v11h-2z M53,50h2v3h-2z M45,51h1v12h-1z M55,51h1v13h-1z M44,52h1v10h-1z M56,52h1v11h-1z M43,53h1v11h-1z M48,53h3v1h-3z M57,53h1v11h-1z M74,53h5v3h-5z M48,54h2v7h-2z M72,54h2v3h-2z M79,54h2v3h-2z M42,55h1v7h-1z M58,55h1v7h-1z M70,55h2v3h-2z M81,55h2v3h-2z M69,56h1v3h-1z M83,56h1v3h-1z M50,57h1v8h-1z M54,57h1v7h-1z M51,58h3v6h-3z M68,58h1v2h-1z M84,58h1v2h-1z M46,61h1v3h-1z M49,61h1v2h-1z M47,63h2v1h-2z M48,64h2v1h-2z M51,64h2v1h-2z M46,66h2v1h-2z M53,66h2v1h-2z M48,67h5v1h-5z"
          />
          <path fill="#FFFFFF" d="M51,53h3v5h-3z M50,54h1v3h-1z M54,54h1v3h-1z" />
          <path fill="#552982" d="M49,63h1v1h-1z M47,61h2v2h-2z" />
          <path
            fill="#19476E"
            d="M56,63h1v1h-1z M44,62h1v2h-1z M45,63h1v2h-1z M46,64h2v2h-2z M53,64h3v1h-3z M48,65h7v1h-7z M48,66h5v1h-5z"
          />
        </g>
      )

    case 8: // yellow
      return (
        <g className='gotchipus-eye'>
          <path
            fill="#E68311"
            d="M33,44h1v1h-1z M93,44h1v1h-1z M36,46h1v1h-1z M43,46h1v1h-1z M83,46h1v1h-1z M90,46h1v1h-1z M37,47h1v1h-1z M44,47h1v1h-1z M82,47h1v1h-1z M89,47h1v1h-1z M38,48h1v1h-1z M88,48h1v1h-1z M37,49h1v1h-1z M89,49h1v1h-1z M36,50h1v1h-1z M55,50h1v1h-1z M71,50h1v1h-1z M90,50h1v1h-1z M56,51h1v1h-1z M70,51h1v1h-1z M57,52h1v1h-1z M69,52h1v1h-1z M43,64h1v1h-1z M57,64h1v1h-1z M69,64h1v1h-1z M83,64h1v1h-1z M44,65h1v1h-1z M56,65h1v1h-1z M70,65h1v1h-1z M82,65h1v1h-1z M45,66h1v1h-1z M55,66h1v1h-1z M71,66h1v1h-1z M81,66h1v1h-1z M34,43h3v1h-3z M90,43h3v1h-3z M37,44h3v1h-3z M87,44h3v1h-3z M34,45h2v1h-2z M40,45h3v1h-3z M84,45h3v1h-3z M91,45h2v1h-2z M42,48h2v1h-2z M48,48h5v1h-5z M74,48h5v1h-5z M83,48h2v1h-2z M43,49h5v1h-5z M53,49h2v1h-2z M72,49h2v1h-2z M79,49h5v1h-5z M37,51h2v1h-2z M88,51h2v1h-2z M39,52h3v1h-3z M85,52h3v1h-3z M42,53h1v2h-1z M58,53h1v2h-1z M68,53h1v2h-1z M84,53h1v2h-1z M41,55h1v7h-1z M59,55h1v7h-1z M67,55h1v7h-1z M85,55h1v7h-1z M42,62h1v2h-1z M58,62h1v2h-1z M68,62h1v2h-1z M84,62h1v2h-1z M46,67h2v1h-2z M53,67h2v1h-2z M72,67h2v1h-2z M79,67h2v1h-2z M48,68h5v1h-5z M74,68h5v1h-5z"
          />
          <path
            fill="#FBCD27"
            d="M37,46h1v1h-1z M89,46h1v1h-1z M39,48h1v1h-1z M87,48h1v1h-1z M42,49h1v1h-1z M84,49h1v1h-1z M37,50h1v1h-1z M89,50h1v1h-1z M42,52h1v1h-1z M54,52h1v1h-1z M72,52h1v1h-1z M84,52h1v1h-1z M34,44h3v1h-3z M90,44h3v1h-3z M36,45h4v1h-4z M87,45h4v1h-4z M40,46h3v1h-3z M84,46h3v1h-3z M38,47h2v1h-2z M42,47h2v1h-2z M83,47h2v1h-2z M87,47h2v1h-2z M41,48h1v2h-1z M85,48h1v2h-1z M38,49h1v2h-1z M48,49h5v2h-5z M74,49h5v2h-5z M88,49h1v2h-1z M39,50h1v2h-1z M43,50h5v1h-5z M53,50h2v2h-2z M72,50h2v2h-2z M79,50h5v1h-5z M87,50h1v2h-1z M40,51h2v1h-2z M45,51h3v1h-3z M55,51h1v3h-1z M71,51h1v3h-1z M79,51h3v1h-3z M85,51h2v1h-2z M56,52h1v4h-1z M70,52h1v4h-1z M43,53h2v3h-2z M57,53h1v11h-1z M69,53h1v11h-1z M82,53h2v3h-2z M42,55h1v7h-1z M58,55h1v7h-1z M68,55h1v7h-1z M84,55h1v7h-1z M43,56h1v8h-1z M83,56h1v8h-1z M44,61h1v4h-1z M56,61h1v4h-1z M70,61h1v4h-1z M82,61h1v4h-1z M45,63h1v3h-1z M55,63h1v3h-1z M71,63h1v3h-1z M81,63h1v3h-1z M46,64h1v3h-1z M54,64h1v3h-1z M72,64h1v3h-1z M80,64h1v3h-1z M47,65h1v2h-1z M53,65h1v2h-1z M73,65h1v2h-1z M79,65h1v2h-1z M48,66h5v2h-5z M74,66h5v2h-5z"
          />
          <path
            fill="#F5EC7F"
            d="M38,46h1v1h-1z M88,46h1v1h-1z M42,50h1v1h-1z M84,50h1v1h-1z M40,47h1v2h-1z M86,47h1v2h-1z M43,51h2v1h-2z M82,51h2v1h-2z"
          />
          <path
            fill="#FFFDEA"
            d="M39,46h1v1h-1z M87,46h1v1h-1z M41,47h1v1h-1z M85,47h1v1h-1z M42,51h1v1h-1z M84,51h1v1h-1z M47,64h1v1h-1z M79,64h1v1h-1z M39,49h2v1h-2z M86,49h2v1h-2z M40,50h2v1h-2z M85,50h2v1h-2z M48,51h5v15h-5z M74,51h5v15h-5z M43,52h5v1h-5z M53,52h1v13h-1z M73,52h1v13h-1z M79,52h5v1h-5z M45,53h3v10h-3z M54,53h1v11h-1z M72,53h1v11h-1z M79,53h3v10h-3z M55,54h1v9h-1z M71,54h1v9h-1z M44,56h1v5h-1z M56,56h1v5h-1z M70,56h1v5h-1z M82,56h1v5h-1z M46,63h2v1h-2z M79,63h2v1h-2z"
          />
        </g>
      )
  }
}

export default eyes;