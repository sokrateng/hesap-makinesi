import { convertBases, isConvertibleInteger, type BaseConversionResult } from '../utils/baseConverter'

interface BaseConversionDisplayProps {
  result: string
  error: string | null
}

/**
 * Shows binary, octal, and hexadecimal conversions below the calculator result
 * when the result is an integer value.
 */
export function BaseConversionDisplay({ result, error }: BaseConversionDisplayProps) {
  if (!result || error || !isConvertibleInteger(result)) {
    return null
  }

  const conversion: BaseConversionResult = convertBases(result)

  if (!conversion.binary) return null

  return (
    <div
      data-testid="base-conversion"
      style={{
        backgroundColor: 'var(--bg-display)',
        padding: '8px 16px',
        borderRadius: '10px',
        marginBottom: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        lineHeight: '1.6',
        color: 'var(--text-expression)',
        transition: 'background-color 300ms',
        animation: 'fadeIn 200ms',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <span>
          <span style={{ opacity: 0.6, marginRight: '4px' }}>BIN</span>
          {conversion.binary}
        </span>
        <span>
          <span style={{ opacity: 0.6, marginRight: '4px' }}>OCT</span>
          {conversion.octal}
        </span>
        <span>
          <span style={{ opacity: 0.6, marginRight: '4px' }}>HEX</span>
          {conversion.hexadecimal}
        </span>
      </div>
    </div>
  )
}
