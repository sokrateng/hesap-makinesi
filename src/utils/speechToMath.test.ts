import { describe, it, expect } from 'vitest'
import { speechToMath } from './speechToMath'

describe('speechToMath', () => {
  it('converts basic arithmetic words', () => {
    expect(speechToMath('beş artı üç')).toEqual({ type: 'expression', value: '5+3', autoCalculate: false })
  })

  it('converts multiplication', () => {
    expect(speechToMath('dört çarpı altı')).toEqual({ type: 'expression', value: '4×6', autoCalculate: false })
  })

  it('converts division', () => {
    expect(speechToMath('on bölü iki')).toEqual({ type: 'expression', value: '10÷2', autoCalculate: false })
  })

  it('converts trig functions', () => {
    expect(speechToMath('sinüs dokuz')).toEqual({ type: 'expression', value: 'sin(9', autoCalculate: false })
  })

  it('converts karekök', () => {
    expect(speechToMath('karekök on altı')).toEqual({ type: 'expression', value: '√(106', autoCalculate: false })
  })

  it('recognizes eşittir command', () => {
    expect(speechToMath('eşittir')).toEqual({ type: 'command', value: 'equals', autoCalculate: false })
  })

  it('recognizes hesapla command', () => {
    expect(speechToMath('hesapla')).toEqual({ type: 'command', value: 'equals', autoCalculate: false })
  })

  it('recognizes temizle command', () => {
    expect(speechToMath('temizle')).toEqual({ type: 'command', value: 'clear', autoCalculate: false })
  })

  it('recognizes sil command', () => {
    expect(speechToMath('sil')).toEqual({ type: 'command', value: 'clear', autoCalculate: false })
  })

  it('auto-calculates expression ending with eşittir', () => {
    const result = speechToMath('beş artı üç eşittir')
    expect(result.type).toBe('expression')
    expect(result.value).toBe('5+3')
    expect(result.autoCalculate).toBe(true)
  })

  it('converts pi', () => {
    expect(speechToMath('iki çarpı pi')).toEqual({ type: 'expression', value: '2×π', autoCalculate: false })
  })

  it('handles ASCII variants without diacritics', () => {
    expect(speechToMath('bes arti uc')).toEqual({ type: 'expression', value: '5+3', autoCalculate: false })
  })

  it('converts virgül to decimal point', () => {
    expect(speechToMath('üç virgül beş')).toEqual({ type: 'expression', value: '3.5', autoCalculate: false })
  })

  it('passes through numeric values from speech API', () => {
    expect(speechToMath('1500 çarpı 500')).toEqual({ type: 'expression', value: '1500×500', autoCalculate: false })
  })

  it('handles mixed numbers and words', () => {
    expect(speechToMath('1500 artı beş')).toEqual({ type: 'expression', value: '1500+5', autoCalculate: false })
  })

  it('handles pure numeric expression with x', () => {
    expect(speechToMath('1500 x 500')).toEqual({ type: 'expression', value: '1500×500', autoCalculate: false })
  })

  it('handles decimal numbers from speech', () => {
    expect(speechToMath('3,14 çarpı iki')).toEqual({ type: 'expression', value: '3.14×2', autoCalculate: false })
  })
})

describe('speechToMath — conversational tail phrases', () => {
  it('strips "kaç eder" and auto-calculates', () => {
    const result = speechToMath('dört çarpı beş kaç eder')
    expect(result.value).toBe('4×5')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "kaç yapar" and auto-calculates', () => {
    const result = speechToMath('on bölü iki kaç yapar')
    expect(result.value).toBe('10÷2')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "sonucu nedir" and auto-calculates', () => {
    const result = speechToMath('1500 çarpı 500 sonucu nedir')
    expect(result.value).toBe('1500×500')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "nedir" and auto-calculates', () => {
    const result = speechToMath('beş artı üç nedir')
    expect(result.value).toBe('5+3')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "ne eder" and auto-calculates', () => {
    const result = speechToMath('yedi çarpı sekiz ne eder')
    expect(result.value).toBe('7×8')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "kaçtır" and auto-calculates', () => {
    const result = speechToMath('dokuz eksi üç kaçtır')
    expect(result.value).toBe('9-3')
    expect(result.autoCalculate).toBe(true)
  })

  it('strips "kaç" alone and auto-calculates', () => {
    const result = speechToMath('iki çarpı altı kaç')
    expect(result.value).toBe('2×6')
    expect(result.autoCalculate).toBe(true)
  })

  it('handles numeric with tail phrase', () => {
    const result = speechToMath('1500 çarpı 500 kaç eder')
    expect(result.value).toBe('1500×500')
    expect(result.autoCalculate).toBe(true)
  })
})
