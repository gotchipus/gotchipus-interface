import { Trans as I18NextTrans } from 'react-i18next'
import { ReactNode, ReactElement } from 'react'
import { TranslationKey } from '../types'

interface TransProps {
  i18nKey: TranslationKey
  values?: Record<string, any>
  components?: Record<string, ReactElement>
  children?: ReactNode
}

export function Trans({ i18nKey, values, components, children }: TransProps) {
  return (
    <I18NextTrans
      i18nKey={i18nKey}
      values={values}
      components={components}
    >
      {children}
    </I18NextTrans>
  )
} 