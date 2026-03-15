'use client'

import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">{t('home.title')}</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <nav className="nav">
            <Link href="/">{t('common.search')}</Link>
            <Link href="/about">{t('common.about')}</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

