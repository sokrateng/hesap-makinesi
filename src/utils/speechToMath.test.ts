import { describe, it, expect } from 'vitest'
import { speechToMath } from './speechToMath'

describe('speechToMath', () => {
  it('converts basic arithmetic words', () => {
    expect(speechToMath('beş artı üç')).toEqual({ type: 'expression', value: '5+3' })
  })

  it('converts multiplication', () => {
    expect(speechToMath('dört çarpı altı')).toEqual({ type: 'expression', value: '4×6' })
  })

  it('converts division', () => {
    expect(speechToMath('on bölü iki')).toEqual({ type: 'expression', value: '10÷2' })
  })

  it('converts trig functions', () => {
    expect(speechToMath('sinüs dokuz')).toEqual({ type: 'expression', value: 'sin(9' })
  })

  it('converts karekök', () => {
    expect(speechToMath('karekök on altı')).toEqual({ type: 'expression', value: '√(106' })
  })

  it('recognizes eşittir command', () => {
    expect(speechToMath('eşittir')).toEqual({ type: 'command', value: 'equals' })
  })

  it('recognizes hesapla command', () => {
    expect(speechToMath('hesapla')).toEqual({ type: 'command', value: 'equals' })
  })

  it('recognizes temizle command', () => {
    expect(speechToMath('temizle')).toEqual({ type: 'command', value: 'clear' })
  })

  it('recognizes sil command', () => {
    expect(speechToMath('sil')).toEqual({ type: 'command', value: 'clear' })
  })

  it('handles expression ending with eşittir', () => {
    const result = speechToMath('beş artı üç eşittir')
    expect(result.type).toBe('expression')
    expect(result.value).toContain('=')
  })

  it('converts pi', () => {
    expect(speechToMath('iki çarpı pi')).toEqual({ type: 'expression', value: '2×π' })
  })

  it('handles ASCII variants without diacritics', () => {
    expect(speechToMath('bes arti uc')).toEqual({ type: 'expression', value: '5+3' })
  })

  it('converts virgül to decimal point', () => {
    expect(speechToMath('üç virgül beş')).toEqual({ type: 'expression', value: '3.5' })
  })
})
