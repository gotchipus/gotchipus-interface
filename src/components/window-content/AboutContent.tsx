'use client'

import Image from "next/image"
import { Trans, useTranslation } from "react-i18next"
import useResponsive from "@/hooks/useResponsive"

export default function AboutContent() {
  const { t } = useTranslation()
  const isMobile = useResponsive()

  return (
    <div className={`flex flex-col items-center ${isMobile ? 'p-2' : 'p-4'}`}>
      <Image 
        src="/about-image.png" 
        alt="about" 
        width={isMobile ? 400 : 800} 
        height={isMobile ? 200 : 400} 
        className="w-full h-auto"
      />
      <h2 className={`font-bold mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>{t("about.title")}</h2>
      <p className={`mb-3 ${isMobile ? 'text-sm' : ''}`}>
        <Trans i18nKey="about.about">{t("about.about")}</Trans>
      </p> 
    </div>
  )
}