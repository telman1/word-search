'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ARMENIAN_ROWS = [
  ['ա', 'բ', 'գ', 'դ', 'ե', 'զ', 'է', 'ը', 'թ', 'ժ'],
  ['ի', 'լ', 'խ', 'ծ', 'կ', 'հ', 'ձ', 'ղ', 'ճ', 'մ'],
  ['յ', 'ն', 'շ', 'ո', 'չ', 'պ', 'ջ', 'ռ', 'ս', 'վ'],
  ['տ', 'ր', 'ց', 'ւ', 'փ', 'ք', 'և', 'օ', 'ֆ'],
]

function insertAtSelection(value, start, end, text) {
  const s = Math.max(0, start ?? value.length)
  const e = Math.max(s, end ?? value.length)
  return value.slice(0, s) + text + value.slice(e)
}

function applyBackspace(value, start, end) {
  const s = Math.max(0, start ?? value.length)
  const e = Math.max(s, end ?? value.length)
  if (s !== e) return { next: value.slice(0, s) + value.slice(e), pos: s }
  if (s <= 0) return { next: value, pos: 0 }
  return { next: value.slice(0, s - 1) + value.slice(e), pos: s - 1 }
}

function KeyboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 7h2v2H4V7zm3 0h2v2H7V7zm3 0h2v2h-2V7zm3 0h2v2h-2V7zm3 0h2v2h-2V7zM4 10h2v2H4v-2zm3 0h2v2H7v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM6 17h12v2H6v-2zm2-4h8v2H8v-2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArmenianKeyboardOverlay({ panelId, title, spaceLabel, dismissLabel, onClose, onInsert, onBackspace, onSpace }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="armenian-keyboard-root" role="presentation">
      <button type="button" className="armenian-keyboard-backdrop" aria-label={dismissLabel} onClick={onClose} />
      <div
        id={panelId}
        className="armenian-keyboard-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="armenian-keyboard-header">
          <span className="armenian-keyboard-title">{title}</span>
          <button type="button" className="armenian-keyboard-close" onClick={onClose} aria-label={dismissLabel}>
            ×
          </button>
        </div>
        <div className="armenian-keyboard-rows">
          {ARMENIAN_ROWS.map((row, ri) => (
            <div key={ri} className="armenian-keyboard-row">
              {row.map((ch) => (
                <button key={ch} type="button" className="armenian-keyboard-key" onClick={() => onInsert(ch)}>
                  {ch}
                </button>
              ))}
            </div>
          ))}
          <div className="armenian-keyboard-row armenian-keyboard-row-actions">
            <button type="button" className="armenian-keyboard-key armenian-keyboard-key-wide" onClick={onSpace}>
              {spaceLabel}
            </button>
            <button type="button" className="armenian-keyboard-key armenian-keyboard-key-backspace" onClick={onBackspace}>
              ⌫
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchInputWithKeyboard({
  value,
  onChange,
  className = '',
  ...inputProps
}) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const selRef = useRef({ start: 0, end: 0 })
  const keyboardPanelId = useId()

  const syncSelection = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    selRef.current = {
      start: el.selectionStart ?? value.length,
      end: el.selectionEnd ?? value.length,
    }
  }, [value.length])

  const emitChange = useCallback(
    (nextValue, cursorPos) => {
      const el = inputRef.current
      const pos = cursorPos ?? nextValue.length
      selRef.current = { start: pos, end: pos }
      onChange?.({ target: { value: nextValue } })
      requestAnimationFrame(() => {
        if (!el) return
        el.focus()
        try {
          el.setSelectionRange(pos, pos)
        } catch {
          /* ignore */
        }
      })
    },
    [onChange]
  )

  const handleInsert = useCallback(
    (ch) => {
      const { start, end } = selRef.current
      const next = insertAtSelection(value, start, end, ch)
      emitChange(next, start + ch.length)
    },
    [value, emitChange]
  )

  const handleBackspace = useCallback(() => {
    const { start, end } = selRef.current
    const { next, pos } = applyBackspace(value, start, end)
    emitChange(next, pos)
  }, [value, emitChange])

  const handleSpace = useCallback(() => {
    handleInsert(' ')
  }, [handleInsert])

  const openKeyboard = useCallback(() => {
    syncSelection()
    setKeyboardOpen(true)
  }, [syncSelection])

  const title = t('common.armenianKeyboardTitle')
  const spaceLabel = t('common.keyboardSpace')
  const dismissLabel = t('common.dismissKeyboard')

  return (
    <div className="search-input-wrap">
      <input
        {...inputProps}
        ref={inputRef}
        id={inputProps.id}
        className={`${className} search-input--with-keyboard`.trim()}
        value={value}
        onChange={(e) => {
          syncSelection()
          onChange?.(e)
        }}
        onSelect={syncSelection}
        onKeyUp={syncSelection}
        onMouseUp={syncSelection}
      />
      <button
        type="button"
        className="search-input-keyboard-btn"
        onMouseDown={(e) => e.preventDefault()}
        onClick={openKeyboard}
        aria-label={t('common.openArmenianKeyboard')}
        aria-expanded={keyboardOpen}
        aria-controls={keyboardPanelId}
      >
        <KeyboardIcon />
      </button>
      {keyboardOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <ArmenianKeyboardOverlay
            panelId={keyboardPanelId}
            title={title}
            spaceLabel={spaceLabel}
            dismissLabel={dismissLabel}
            onClose={() => setKeyboardOpen(false)}
            onInsert={handleInsert}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
          />,
          document.body
        )}
    </div>
  )
}
