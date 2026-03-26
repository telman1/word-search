'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Image
            src="/gulbenkian-l.jpg"
            alt={t('footer.gulbenkianAlt')}
            width={480}
            height={155}
            className="footer-logo"
          />
        </div>
        <div className="footer-panels">
          <nav className="footer-nav" aria-label={t('footer.linksTitle')}>
            <h3>{t('footer.linksTitle')}</h3>
            <ul>
              <li>
                <Link href="/">{t('common.search')}</Link>
              </li>
              <li>
                <Link href="/about">{t('common.about')}</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-contact">
            <h3>{t('about.contact.title')}</h3>
            <p className="footer-contact-line">
              <a href="mailto:info@example.com">info@example.com</a>
            </p>
            <p className="footer-contact-line">
              <a href="/">{t('about.contact.websiteLink')}</a>
            </p>
          </div>
        </div>
      </div>
      <p className="footer-copy">
        © {year} {t('home.title')}
      </p>
    </footer>
  )
}
