import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ValidationWarnings } from './ValidationWarnings'

describe('ValidationWarnings', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders nothing for empty expression', () => {
    const { container } = render(<ValidationWarnings expression="" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing for valid expression', () => {
    const { container } = render(<ValidationWarnings expression="2+3" />)
    expect(container.innerHTML).toBe('')
  })

  it('shows warning for unmatched open parenthesis', () => {
    const { getByTestId } = render(<ValidationWarnings expression="(2+3" />)
    const el = getByTestId('validation-warnings')
    expect(el.textContent).toContain('parantez')
  })

  it('shows warning for unmatched close parenthesis', () => {
    const { getByTestId } = render(<ValidationWarnings expression="2+3)" />)
    const el = getByTestId('validation-warnings')
    expect(el.textContent).toContain('parantez')
  })

  it('shows warning for consecutive operators', () => {
    const { getByTestId } = render(<ValidationWarnings expression="2++3" />)
    const el = getByTestId('validation-warnings')
    expect(el.textContent).toContain('operator')
  })

  it('shows warning for empty parentheses', () => {
    const { getByTestId } = render(<ValidationWarnings expression="2+()" />)
    const el = getByTestId('validation-warnings')
    expect(el.textContent).toContain('parantez')
  })

  it('does not show trailing operator warning (user still typing)', () => {
    const { container } = render(<ValidationWarnings expression="2+" />)
    // trailing operator is filtered out while typing
    expect(container.innerHTML).toBe('')
  })

  it('shows multiple warnings when multiple issues exist', () => {
    const { getByTestId } = render(<ValidationWarnings expression="(2++3" />)
    const el = getByTestId('validation-warnings')
    // Should have both unmatched paren and consecutive operators
    const warnings = el.querySelectorAll('div > div')
    expect(warnings.length).toBeGreaterThanOrEqual(2)
  })

  it('renders nothing for whitespace-only expression', () => {
    const { container } = render(<ValidationWarnings expression="   " />)
    expect(container.innerHTML).toBe('')
  })

  it('shows warning for leading multiplication operator', () => {
    const { getByTestId } = render(<ValidationWarnings expression="*3+2" />)
    const el = getByTestId('validation-warnings')
    expect(el.textContent).toContain('baslayamaz')
  })

  it('does not warn for leading minus (unary)', () => {
    const { container } = render(<ValidationWarnings expression="-3+2" />)
    expect(container.innerHTML).toBe('')
  })
})
