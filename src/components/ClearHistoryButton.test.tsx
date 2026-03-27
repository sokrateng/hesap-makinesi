import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ClearHistoryButton } from './ClearHistoryButton'

describe('ClearHistoryButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders nothing when disabled', () => {
    const onClear = vi.fn()
    const { container } = render(<ClearHistoryButton onClear={onClear} disabled />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the button when not disabled', () => {
    const onClear = vi.fn()
    render(<ClearHistoryButton onClear={onClear} />)
    expect(screen.getByLabelText('Gecmisi temizle')).toBeTruthy()
  })

  it('shows confirmation on first click', () => {
    const onClear = vi.fn()
    render(<ClearHistoryButton onClear={onClear} />)

    fireEvent.click(screen.getByLabelText('Gecmisi temizle'))

    expect(screen.getByLabelText('Gecmisi silmeyi onayla')).toBeTruthy()
    expect(screen.getByText('Emin misin?')).toBeTruthy()
    expect(onClear).not.toHaveBeenCalled()
  })

  it('calls onClear on second click (confirmation)', () => {
    const onClear = vi.fn()
    render(<ClearHistoryButton onClear={onClear} />)

    fireEvent.click(screen.getByLabelText('Gecmisi temizle'))
    fireEvent.click(screen.getByLabelText('Gecmisi silmeyi onayla'))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('cancels confirmation when Iptal is clicked', () => {
    const onClear = vi.fn()
    render(<ClearHistoryButton onClear={onClear} />)

    fireEvent.click(screen.getByLabelText('Gecmisi temizle'))
    expect(screen.getByText('Iptal')).toBeTruthy()

    fireEvent.click(screen.getByLabelText('Gecmisi silmeyi iptal et'))

    expect(screen.getByText('Gecmisi Temizle')).toBeTruthy()
    expect(onClear).not.toHaveBeenCalled()
  })

  it('resets to initial state after clearing', () => {
    const onClear = vi.fn()
    render(<ClearHistoryButton onClear={onClear} />)

    fireEvent.click(screen.getByLabelText('Gecmisi temizle'))
    fireEvent.click(screen.getByLabelText('Gecmisi silmeyi onayla'))

    expect(screen.getByText('Gecmisi Temizle')).toBeTruthy()
  })
})
