import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MicButton } from './MicButton'

afterEach(cleanup)

describe('MicButton', () => {
  it('renders nothing when not supported', () => {
    const { container } = render(
      <MicButton status="idle" onToggle={() => {}} isSupported={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders mic button when supported', () => {
    render(<MicButton status="idle" onToggle={() => {}} isSupported={true} />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('shows microphone icon when idle', () => {
    render(<MicButton status="idle" onToggle={() => {}} isSupported={true} />)
    const button = screen.getByRole('button')
    expect(button.textContent).toBe('🎤')
  })

  it('shows stop icon when listening', () => {
    render(<MicButton status="listening" onToggle={() => {}} isSupported={true} />)
    const button = screen.getByRole('button')
    expect(button.textContent).toBe('⏹')
  })

  it('applies listening class when listening', () => {
    render(<MicButton status="listening" onToggle={() => {}} isSupported={true} />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('listening')
  })

  it('does not apply listening class when idle', () => {
    render(<MicButton status="idle" onToggle={() => {}} isSupported={true} />)
    const button = screen.getByRole('button')
    expect(button.className).not.toContain('listening')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<MicButton status="idle" onToggle={onToggle} isSupported={true} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('has correct title when idle', () => {
    render(<MicButton status="idle" onToggle={() => {}} isSupported={true} />)
    expect(screen.getByRole('button').getAttribute('title')).toBe('Sesle komut ver')
  })

  it('has correct title when listening', () => {
    render(<MicButton status="listening" onToggle={() => {}} isSupported={true} />)
    expect(screen.getByRole('button').getAttribute('title')).toBe('Dinlemeyi durdur')
  })
})
