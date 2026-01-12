import type { JSX } from "react"

export interface GotchipusPreview {
  id: string;
  traitsIndex: number[];
  image: string | JSX.Element;
}

export interface PharosGenesisPageProps {
  tokenId: string
  gotchipusPreviews: GotchipusPreview[]
  selectedPreviewIndex: number
  onPreviewSelect: (index: number) => void
  onClose?: () => void
  tokenBoundAccount: string
  dna: string
}

