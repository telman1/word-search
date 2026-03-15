'use client'

import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.scss'

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value)
  }

  return (
    <div className="language-switcher">
      <select
        className="language-select"
        value={language}
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="hy">Հայերեն</option>
      </select>
    </div>
  )
}

