'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <Image
            src="/ari.png"
            alt=""
            width={52}
            height={52}
            className="logo-img"
            priority
          />
          <span>{t('home.title')}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <nav className="nav">
            <Link href="/">{t('common.search')}</Link>
            <Link href="/enhanced-search">{t('enhancedSearch.nav')}</Link>
            <Link href="/about">{t('common.about')}</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

