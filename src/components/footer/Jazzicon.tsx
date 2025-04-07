'use client'

import Jazzicon from 'react-jazzicon'

interface JazziconProps {
  address: string
  diameter?: number
  className?: string
}

export const CustomJazzicon = ({ address, diameter = 24, className = '' }: JazziconProps) => {
  const seed = parseInt(address.slice(2, 10), 16)

  return (
    <div className={className}>
      <Jazzicon diameter={diameter} seed={seed} />
    </div>
  )
}