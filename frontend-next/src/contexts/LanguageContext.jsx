'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState(null)

  useEffect(() => {
    // Load language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
    loadTranslations(savedLanguage)
  }, [])

  const loadTranslations = async (lang) => {
    try {
      const translationModule = await import(`../translations/${lang}.json`)
      // Handle both default export and named export
      const translationsData = translationModule.default || translationModule
      setTranslations(translationsData)
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error)
      // Fallback to English if translation file doesn't exist
      if (lang !== 'en') {
        try {
          const fallback = await import(`../translations/en.json`)
          setTranslations(fallback.default || fallback)
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError)
        }
      }
    }
  }

  const changeLanguage = async (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    await loadTranslations(lang)
  }

  const t = (key) => {
    if (!translations) {
      // Return empty array for array keys, empty string for others
      if (key.includes('.items')) {
        return []
      }
      return key
    }
    
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // If key ends with .items, return empty array as fallback
        if (key.includes('.items')) {
          return []
        }
        return key
      }
    }
    
    // Return the value as-is if it's a string, array, or other valid type
    if (typeof value === 'string' || Array.isArray(value)) {
      return value
    }
    
    // If we expected an array but got something else, return empty array
    if (key.includes('.items')) {
      return []
    }
    
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

