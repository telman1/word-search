'use client'

/**
 * @param {number} page
 * @param {number} pageCount
 * @returns {(number | 'gap')[]}
 */
function getPageList(page, pageCount) {
  if (pageCount <= 1) return []
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }
  const set = new Set()
  set.add(1)
  set.add(pageCount)
  for (let p = page - 1; p <= page + 1; p++) {
    if (p >= 1 && p <= pageCount) set.add(p)
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      out.push('gap')
    }
    out.push(sorted[i])
  }
  return out
}

/**
 * @param {{ page: number, pageCount: number, onPageChange: (p: number) => void, t: (key: string) => string, disabled?: boolean }} props
 */
export default function SearchPagination({ page, pageCount, onPageChange, t, disabled = false }) {
  if (pageCount <= 1) return null
  const label = t('common.pageIndicator')
    .replace('{current}', String(page))
    .replace('{total}', String(pageCount))
  const items = getPageList(page, pageCount)
  return (
    <nav className="search-pagination" aria-label={t('common.paginationNav')}>
      <button
        type="button"
        className="search-pagination-button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t('common.prevPage')}
      </button>
      <ol className="search-pagination-pages" role="list">
        {items.map((item, i) =>
          item === 'gap' ? (
            <li key={`e-${i}`} className="search-pagination-ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={'search-pagination-page' + (item === page ? ' is-current' : '')}
                disabled={disabled}
                onClick={() => {
                  if (item === page) return
                  onPageChange(item)
                }}
                aria-label={t('common.goToPage').replace('{n}', String(item))}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ol>
      <span className="search-pagination-indicator" aria-hidden="true">
        {label}
      </span>
      <button
        type="button"
        className="search-pagination-button"
        disabled={disabled || page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        {t('common.nextPage')}
      </button>
    </nav>
  )
}
