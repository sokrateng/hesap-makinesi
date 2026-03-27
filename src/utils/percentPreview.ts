import { evaluate, type AngleMode } from './parser'

export interface PercentPreviewResult {
  /** The original expression before percent application */
  readonly originalExpression: string
  /** The expression with percent applied (expr / 100) */
  readonly percentExpression: string
  /** The computed numeric result as string, or null on error */
  readonly result: string | null
  /** Error message if evaluation fails, null otherwise */
  readonly error: string | null
}

/**
 * Computes a live preview of applying percent to the current expression.
 * Shows both the transformed expression and its evaluated result.
 *
 * @param expression - The current calculator expression (e.g. "50", "200+50")
 * @param angleMode - Current angle mode for trigonometric functions
 * @returns Preview object with original expression, percent expression, result, and error
 */
export function computePercentPreview(
  expression: string,
  angleMode: AngleMode = 'deg'
): PercentPreviewResult {
  const trimmed = expression.trim()

  if (!trimmed) {
    return {
      originalExpression: '',
      percentExpression: '',
      result: null,
      error: null,
    }
  }

  const percentExpression = `${trimmed} / 100`

  const { result, error } = evaluate(percentExpression, angleMode)

  return {
    originalExpression: trimmed,
    percentExpression,
    result,
    error,
  }
}

/**
 * Formats the percent preview for display.
 * Returns a human-readable string like "50% = 0.5"
 *
 * @param preview - The preview result from computePercentPreview
 * @returns Formatted display string, or empty string if no valid preview
 */
export function formatPercentPreview(preview: PercentPreviewResult): string {
  if (!preview.originalExpression) {
    return ''
  }

  if (preview.error) {
    return `${preview.originalExpression}% = ?`
  }

  return `${preview.originalExpression}% = ${preview.result}`
}
