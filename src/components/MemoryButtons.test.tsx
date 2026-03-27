import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryButtons } from './MemoryButtons'

afterEach(() => {
  cleanup()
})

function renderButtons(overrides: Partial<Parameters<typeof MemoryButtons>[0]> = {}) {
  const props = {
    hasMemory: false,
    onMemoryAdd: vi.fn(),
    onMemorySubtract: vi.fn(),
    onMemoryRecall: vi.fn(),
    onMemoryClear: vi.fn(),
    ...overrides,
  }
  const { container } = render(<MemoryButtons {...props} />)
  return { props, container }
}

describe('MemoryButtons', () => {
  it('renders all four memory buttons', () => {
    renderButtons()
    expect(screen.getByTitle('Hafizaya ekle (M+)')).toBeDefined()
    expect(screen.getByTitle('Hafizadan cikar (M-)')).toBeDefined()
    expect(screen.getByTitle('Hafizadan geri cagir (MR)')).toBeDefined()
    expect(screen.getByTitle('Hafizayi temizle (MC)')).toBeDefined()
  })

  it('calls onMemoryAdd when M+ is clicked', () => {
    const { props } = renderButtons()
    fireEvent.click(screen.getByTitle('Hafizaya ekle (M+)'))
    expect(props.onMemoryAdd).toHaveBeenCalledOnce()
  })

  it('calls onMemorySubtract when M- is clicked', () => {
    const { props } = renderButtons()
    fireEvent.click(screen.getByTitle('Hafizadan cikar (M-)'))
    expect(props.onMemorySubtract).toHaveBeenCalledOnce()
  })

  it('calls onMemoryRecall when MR is clicked and hasMemory is true', () => {
    const { props } = renderButtons({ hasMemory: true })
    fireEvent.click(screen.getByTitle('Hafizadan geri cagir (MR)'))
    expect(props.onMemoryRecall).toHaveBeenCalledOnce()
  })

  it('does NOT call onMemoryRecall when MR is clicked and hasMemory is false', () => {
    const { props } = renderButtons({ hasMemory: false })
    fireEvent.click(screen.getByTitle('Hafizadan geri cagir (MR)'))
    expect(props.onMemoryRecall).not.toHaveBeenCalled()
  })

  it('calls onMemoryClear when MC is clicked and hasMemory is true', () => {
    const { props } = renderButtons({ hasMemory: true })
    fireEvent.click(screen.getByTitle('Hafizayi temizle (MC)'))
    expect(props.onMemoryClear).toHaveBeenCalledOnce()
  })

  it('does NOT call onMemoryClear when MC is clicked and hasMemory is false', () => {
    const { props } = renderButtons({ hasMemory: false })
    fireEvent.click(screen.getByTitle('Hafizayi temizle (MC)'))
    expect(props.onMemoryClear).not.toHaveBeenCalled()
  })

  it('MR and MC have reduced opacity when hasMemory is false', () => {
    renderButtons({ hasMemory: false })
    const mr = screen.getByTitle('Hafizadan geri cagir (MR)')
    const mc = screen.getByTitle('Hafizayi temizle (MC)')
    expect(mr.style.opacity).toBe('0.4')
    expect(mc.style.opacity).toBe('0.4')
  })

  it('MR and MC have full opacity when hasMemory is true', () => {
    renderButtons({ hasMemory: true })
    const mr = screen.getByTitle('Hafizadan geri cagir (MR)')
    const mc = screen.getByTitle('Hafizayi temizle (MC)')
    expect(mr.style.opacity).not.toBe('0.4')
    expect(mc.style.opacity).not.toBe('0.4')
  })

  it('M+ and M- are always clickable regardless of hasMemory', () => {
    const { props } = renderButtons({ hasMemory: false })
    fireEvent.click(screen.getByTitle('Hafizaya ekle (M+)'))
    fireEvent.click(screen.getByTitle('Hafizadan cikar (M-)'))
    expect(props.onMemoryAdd).toHaveBeenCalledOnce()
    expect(props.onMemorySubtract).toHaveBeenCalledOnce()
  })
})
