'use client'

import Image from "next/image"
import { Trans, useTranslation } from "react-i18next"
import useResponsive from "@/hooks/useResponsive"

export default function AboutContent() {
  const { t } = useTranslation()
  const isMobile = useResponsive()

  return (
    <div className={`bg-[#c0c0c0] w-full h-full ${isMobile ? 'p-2' : 'p-4'} space-y-4`}>
      
      <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-4">
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-[#808080] p-2">
            <Image 
              src="/pus.png" 
              alt="App Icon" 
              width={48} 
              height={48} 
              className="pixelated"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("about.appName")}</h2>
            <p className="text-sm">{t("about.version")}</p>
            <p className="text-xs text-gray-600">{t("about.copyright")}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3">
        <h3 className="font-bold mb-2 text-sm">{t("about.title")}</h3>
        <p className="text-sm leading-relaxed">
          <Trans i18nKey="about.about">{t("about.about")}</Trans>
        </p>
      </div>

      <div className="bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-4">
        <h3 className="font-bold mb-3 text-sm">{t("about.partners.title")}</h3>
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {[1, 2, 3, 4, 5, 6, 7].map((partner) => (
            <div key={partner} className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-3 hover:bg-[#b8b8b8] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-white border border-[#808080] p-1">
                  <Image 
                    src={t(`about.partners.partner${partner}.url`)} 
                    alt={`Partner ${partner}`} 
                    width={32} 
                    height={32} 
                    className="pixelated"
                  />
                </div>
                <span className="text-sm font-bold">{t(`about.partners.partner${partner}.name`)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}