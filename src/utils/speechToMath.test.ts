import { describe, it, expect } from 'vitest'
import { speechToMath } from './speechToMath'

describe('speechToMath — basic conversions', () => {
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

  it('converts pi', () => {
    expect(speechToMath('iki çarpı pi')).toEqual({ type: 'expression', value: '2×π' })
  })

  it('handles ASCII variants without diacritics', () => {
    expect(speechToMath('bes arti uc')).toEqual({ type: 'expression', value: '5+3' })
  })

  it('converts virgül to decimal point', () => {
    expect(speechToMath('üç virgül beş')).toEqual({ type: 'expression', value: '3.5' })
  })

  it('passes through numeric values from speech API', () => {
    expect(speechToMath('1500 çarpı 500')).toEqual({ type: 'expression', value: '1500×500' })
  })

  it('handles mixed numbers and words', () => {
    expect(speechToMath('1500 artı beş')).toEqual({ type: 'expression', value: '1500+5' })
  })

  it('handles x as multiplication', () => {
    expect(speechToMath('1500 x 500')).toEqual({ type: 'expression', value: '1500×500' })
  })

  it('handles decimal numbers from speech', () => {
    expect(speechToMath('3,14 çarpı iki')).toEqual({ type: 'expression', value: '3.14×2' })
  })
})

describe('speechToMath — commands', () => {
  it('recognizes temizle', () => {
    expect(speechToMath('temizle')).toEqual({ type: 'command', value: 'clear' })
  })

  it('recognizes sil', () => {
    expect(speechToMath('sil')).toEqual({ type: 'command', value: 'clear' })
  })

  it('recognizes eşittir as command when standalone', () => {
    expect(speechToMath('eşittir')).toEqual({ type: 'command', value: 'equals' })
  })

  it('recognizes hesapla as command when standalone', () => {
    expect(speechToMath('hesapla')).toEqual({ type: 'command', value: 'equals' })
  })
})

describe('speechToMath — conversational triggers (auto-calculate)', () => {
  it('handles "4 çarpı 5 kaç eder"', () => {
    const result = speechToMath('4 çarpı 5 kaç eder')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('4×5')
  })

  it('handles "beş artı üç kaç yapar"', () => {
    const result = speechToMath('beş artı üç kaç yapar')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('5+3')
  })

  it('handles "1500 çarpı 500 sonucu nedir"', () => {
    const result = speechToMath('1500 çarpı 500 sonucu nedir')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('1500×500')
  })

  it('handles "on bölü iki ne eder"', () => {
    const result = speechToMath('on bölü iki ne eder')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('10÷2')
  })

  it('handles "4 çarpı 5 kaç"', () => {
    const result = speechToMath('4 çarpı 5 kaç')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('4×5')
  })

  it('handles trailing question mark', () => {
    const result = speechToMath('4 çarpı 5 kaç eder?')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('4×5')
  })

  it('handles "beş artı üç eşittir"', () => {
    const result = speechToMath('beş artı üç eşittir')
    expect(result.type).toBe('expression_auto')
    expect(result.value).toBe('5+3')
  })
})

describe('speechToMath — noise word filtering', () => {
  it('filters out filler words', () => {
    const result = speechToMath('bu beş artı üç')
    expect(result.value).toBe('5+3')
  })
})
