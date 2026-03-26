import { describe, it, expect } from 'vitest'
import { humanize } from './speakResult'

describe('humanize', () => {
  it('formats simple addition', () => {
    expect(humanize('3+5', '8')).toBe('3 artı 5 eşittir 8')
  })

  it('formats multiplication with ×', () => {
    expect(humanize('4×6', '24')).toBe('4 çarpı 6 eşittir 24')
  })

  it('formats division with ÷', () => {
    expect(humanize('10÷2', '5')).toBe('10 bölü 2 eşittir 5')
  })

  it('formats subtraction with −', () => {
    expect(humanize('9−3', '6')).toBe('9 eksi 3 eşittir 6')
  })

  it('formats square root', () => {
    expect(humanize('√(16)', '4')).toBe('karekök 16 eşittir 4')
  })

  it('formats pi', () => {
    expect(humanize('2×π', '6.283185307179586')).toBe('2 çarpı pi eşittir 6.283185307179586')
  })

  it('formats sin', () => {
    expect(humanize('sin(30)', '0.5')).toBe('sinüs 30 eşittir 0.5')
  })

  it('formats cos', () => {
    expect(humanize('cos(0)', '1')).toBe('kosinüs 0 eşittir 1')
  })

  it('formats tan', () => {
    expect(humanize('tan(45)', '1')).toBe('tanjant 45 eşittir 1')
  })

  it('formats exponentiation', () => {
    expect(humanize('2^8', '256')).toBe('2 üssü 8 eşittir 256')
  })

  it('removes leftover parentheses', () => {
    expect(humanize('(3+5)', '8')).toBe('3 artı 5 eşittir 8')
  })

  it('collapses multiple spaces', () => {
    const result = humanize('3+5', '8')
    expect(result).not.toMatch(/\s{2,}/)
  })
})
