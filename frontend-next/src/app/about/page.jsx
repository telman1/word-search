'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import './about.scss'

export default function AboutPage() {
  const { t } = useLanguage()
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>{t('about.title')}</h1>
        <p className="subtitle">{t('about.subtitle')}</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <p className="intro-text">
            <strong>{t('about.intro.title')}</strong> {t('about.intro.text')}
          </p>
        </section>

        <section className="about-section">
          <h2>{t('about.project.title')}</h2>
          <p>
            {t('about.project.text')}
          </p>
        </section>

        <section className="about-section">
          <h2>{t('about.goals.title')}</h2>
          <p>
            {t('about.goals.text')}
          </p>
          <ul>
            {Array.isArray(t('about.goals.items')) 
              ? t('about.goals.items').map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              : null
            }
          </ul>
        </section>

        <section className="about-section">
          <h2>{t('about.features.title')}</h2>
          <p>
            {t('about.features.text')}
          </p>
          <ul>
            {Array.isArray(t('about.features.items'))
              ? t('about.features.items').map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              : null
            }
          </ul>
        </section>

        <section className="about-section">
          <h2>{t('about.contact.title')}</h2>
          <div className="contact-info">
            <p>
              {t('about.contact.text')}
            </p>
            <p className="contact-item">
              <strong>{t('about.contact.email')}</strong> <a href="mailto:info@example.com">info@example.com</a>
            </p>
            <p className="contact-item">
              <strong>{t('about.contact.website')}</strong> <a href="/">{t('about.contact.websiteLink')}</a>
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="back-link">
            <Link href="/">{t('common.backToSearch')}</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

