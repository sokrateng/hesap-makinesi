import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { BackspaceButton } from './BackspaceButton'

describe('BackspaceButton', () => {
  afterEach(() => {
    cleanup()
  })

  function renderButton(props: Partial<{ onClick: () => void; disabled: boolean }> = {}) {
    const onClick = props.onClick ?? (() => {})
    const result = render(<BackspaceButton onClick={onClick} disabled={props.disabled} />)
    const btn = result.container.querySelector('button')!
    return { btn, ...result }
  }

  it('renders the backspace symbol', () => {
    const { btn } = renderButton()
    expect(btn).toBeDefined()
    expect(btn.textContent).toBe('⌫')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    const { btn } = renderButton({ onClick: handleClick })
    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    const { btn } = renderButton({ onClick: handleClick, disabled: true })
    fireEvent.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('has reduced opacity when disabled', () => {
    const { btn } = renderButton({ disabled: true })
    expect(btn.style.opacity).toBe('0.4')
  })

  it('has full opacity when enabled', () => {
    const { btn } = renderButton()
    expect(btn.style.opacity).toBe('1')
  })

  it('has aria-label for accessibility', () => {
    const { btn } = renderButton()
    expect(btn.getAttribute('aria-label')).toBe('Son karakteri sil')
  })

  it('has title attribute with shortcut hint', () => {
    const { btn } = renderButton()
    expect(btn.title).toBe('Backspace (⌫)')
  })

  it('applies brightness on mouse enter and resets on leave', () => {
    const { btn } = renderButton()
    fireEvent.mouseEnter(btn)
    expect(btn.style.filter).toBe('brightness(1.2)')
    fireEvent.mouseLeave(btn)
    expect(btn.style.filter).toBe('brightness(1)')
  })

  it('does not apply brightness on mouse enter when disabled', () => {
    const { btn } = renderButton({ disabled: true })
    fireEvent.mouseEnter(btn)
    expect(btn.style.filter).not.toBe('brightness(1.2)')
  })
})
