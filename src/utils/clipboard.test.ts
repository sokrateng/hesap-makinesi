import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyToClipboard } from './clipboard'

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Ensure execCommand exists on document for jsdom
    if (!document.execCommand) {
      document.execCommand = vi.fn().mockReturnValue(false)
    }
  })

  it('returns false for empty string', async () => {
    expect(await copyToClipboard('')).toBe(false)
  })

  it('returns false for whitespace-only string', async () => {
    expect(await copyToClipboard('   ')).toBe(false)
  })

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText },
    })

    const result = await copyToClipboard('42')

    expect(writeText).toHaveBeenCalledWith('42')
    expect(result).toBe(true)
  })

  it('returns true on successful clipboard write', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    expect(await copyToClipboard('3.14')).toBe(true)
  })

  it('falls back to execCommand when clipboard API fails', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    const execCommand = vi.spyOn(document, 'execCommand').mockReturnValue(true)

    const result = await copyToClipboard('hello')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
  })

  it('returns false when both clipboard API and execCommand fail', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    vi.spyOn(document, 'execCommand').mockReturnValue(false)

    expect(await copyToClipboard('hello')).toBe(false)
  })

  it('returns false when execCommand throws', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    vi.spyOn(document, 'execCommand').mockImplementation(() => {
      throw new Error('not supported')
    })

    expect(await copyToClipboard('hello')).toBe(false)
  })

  it('removes temporary textarea after fallback copy', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    vi.spyOn(document, 'execCommand').mockReturnValue(true)

    const textareasBefore = document.querySelectorAll('textarea').length
    await copyToClipboard('test')
    const textareasAfter = document.querySelectorAll('textarea').length

    expect(textareasAfter).toBe(textareasBefore)
  })
})
