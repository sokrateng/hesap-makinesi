import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { BaseConversionDisplay } from './BaseConversionDisplay'

describe('BaseConversionDisplay', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders base conversions for an integer result', () => {
    const { getByTestId } = render(
      <BaseConversionDisplay result="255" error={null} />
    )
    const el = getByTestId('base-conversion')
    expect(el.textContent).toContain('BIN')
    expect(el.textContent).toContain('11111111')
    expect(el.textContent).toContain('OCT')
    expect(el.textContent).toContain('377')
    expect(el.textContent).toContain('HEX')
    expect(el.textContent).toContain('FF')
  })

  it('renders nothing when result is empty', () => {
    const { container } = render(
      <BaseConversionDisplay result="" error={null} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when there is an error', () => {
    const { container } = render(
      <BaseConversionDisplay result="42" error="Hata" />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing for decimal (non-integer) results', () => {
    const { container } = render(
      <BaseConversionDisplay result="3.14" error={null} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders conversions for zero', () => {
    const { getByTestId } = render(
      <BaseConversionDisplay result="0" error={null} />
    )
    const el = getByTestId('base-conversion')
    expect(el.textContent).toContain('0')
  })

  it('renders conversions for negative integers', () => {
    const { getByTestId } = render(
      <BaseConversionDisplay result="-10" error={null} />
    )
    const el = getByTestId('base-conversion')
    expect(el.textContent).toContain('-1010')
    expect(el.textContent).toContain('-12')
    expect(el.textContent).toContain('-A')
  })

  it('renders conversions for large integers', () => {
    const { getByTestId } = render(
      <BaseConversionDisplay result="1024" error={null} />
    )
    const el = getByTestId('base-conversion')
    expect(el.textContent).toContain('10000000000')
    expect(el.textContent).toContain('2000')
    expect(el.textContent).toContain('400')
  })

  it('renders nothing for scientific notation results', () => {
    const { container } = render(
      <BaseConversionDisplay result="1e10" error={null} />
    )
    expect(container.innerHTML).toBe('')
  })
})
