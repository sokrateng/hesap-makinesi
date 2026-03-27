/** Gecmis hesaplamalar arasinda metin bazli arama */

export interface HistoryEntry {
  readonly expression: string
  readonly result: string
  readonly timestamp: number
}

export interface SearchResult {
  readonly entry: HistoryEntry
  readonly originalIndex: number
  readonly matchField: 'expression' | 'result' | 'both'
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

function matchesField(field: string, normalizedQuery: string): boolean {
  return field.toLowerCase().includes(normalizedQuery)
}

export function searchHistory(
  history: readonly HistoryEntry[],
  query: string
): readonly SearchResult[] {
  const normalizedQuery = normalizeQuery(query)

  if (normalizedQuery === '') {
    return []
  }

  const results: SearchResult[] = []

  for (let i = 0; i < history.length; i++) {
    const entry = history[i]
    const matchExpr = matchesField(entry.expression, normalizedQuery)
    const matchResult = matchesField(entry.result, normalizedQuery)

    if (matchExpr || matchResult) {
      let matchField: SearchResult['matchField']
      if (matchExpr && matchResult) {
        matchField = 'both'
      } else if (matchExpr) {
        matchField = 'expression'
      } else {
        matchField = 'result'
      }

      results.push({
        entry,
        originalIndex: i,
        matchField,
      })
    }
  }

  return results
}

export function highlightMatch(text: string, query: string): readonly string[] {
  const normalizedQuery = normalizeQuery(query)
  if (normalizedQuery === '') {
    return [text]
  }

  const lowerText = text.toLowerCase()
  const parts: string[] = []
  let lastIndex = 0

  let searchStart = 0
  while (searchStart < lowerText.length) {
    const foundIndex = lowerText.indexOf(normalizedQuery, searchStart)
    if (foundIndex === -1) break

    // Add text before match
    if (foundIndex > lastIndex) {
      parts.push(text.slice(lastIndex, foundIndex))
    }

    // Add matched text (preserve original casing)
    parts.push(text.slice(foundIndex, foundIndex + normalizedQuery.length))

    lastIndex = foundIndex + normalizedQuery.length
    searchStart = lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export function getMatchIndices(
  text: string,
  query: string
): readonly { readonly start: number; readonly end: number }[] {
  const normalizedQuery = normalizeQuery(query)
  if (normalizedQuery === '') return []

  const lowerText = text.toLowerCase()
  const indices: { start: number; end: number }[] = []

  let searchStart = 0
  while (searchStart < lowerText.length) {
    const foundIndex = lowerText.indexOf(normalizedQuery, searchStart)
    if (foundIndex === -1) break

    indices.push({
      start: foundIndex,
      end: foundIndex + normalizedQuery.length,
    })
    searchStart = foundIndex + normalizedQuery.length
  }

  return indices
}
