'use client'

import Image from "next/image"
import { Trans, useTranslation } from "react-i18next"

export default function AboutContent() {
  const { t } = useTranslation()
  
  return (
    <div className="p-4 flex flex-col items-center">
      <Image src="/about-image.png" alt="about" width={800} height={400} />
      <h2 className="text-xl font-bold mb-4">{t("about.title")}</h2>
      <p className="mb-3">
        <Trans i18nKey="about.about">{t("about.about")}</Trans>
      </p> 
    </div>
  )
}

