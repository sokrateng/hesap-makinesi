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

  it('converts karekök on altı to √(16', () => {
    expect(speechToMath('karekök on altı')).toEqual({ type: 'expression', value: '√(16' })
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

  it('passes through numeric values from speech API', () => {
    expect(speechToMath('1500 çarpı 500')).toEqual({ type: 'expression', value: '1500×500' })
  })

  it('handles mixed numbers and words', () => {
    expect(speechToMath('1500 artı beş')).toEqual({ type: 'expression', value: '1500+5' })
  })

  it('handles pure numeric expression with x', () => {
    expect(speechToMath('1500 x 500')).toEqual({ type: 'expression', value: '1500×500' })
  })

  it('handles decimal numbers from speech', () => {
    expect(speechToMath('3,14 çarpı iki')).toEqual({ type: 'expression', value: '3.14×2' })
  })

  it('strips "kaç eder" from expression', () => {
    expect(speechToMath('5 çarpı 5 kaç eder')).toEqual({ type: 'expression', value: '5×5' })
  })

  it('strips "ne eder" from expression', () => {
    expect(speechToMath('beş artı üç ne eder')).toEqual({ type: 'expression', value: '5+3' })
  })

  it('strips "nedir" from expression', () => {
    expect(speechToMath('on bölü iki nedir')).toEqual({ type: 'expression', value: '10÷2' })
  })

  it('strips "sonucu nedir" from expression', () => {
    expect(speechToMath('üç çarpı yedi sonucu nedir')).toEqual({ type: 'expression', value: '3×7' })
  })

  it('strips "bul" from expression', () => {
    expect(speechToMath('iki artı iki bul')).toEqual({ type: 'expression', value: '2+2' })
  })

  it('strips "kaçtır" from expression', () => {
    expect(speechToMath('sekiz bölü dört kaçtır')).toEqual({ type: 'expression', value: '8÷4' })
  })

  it('strips multiple noise words', () => {
    expect(speechToMath('bu işlemin sonucu kaç')).toEqual({ type: 'expression', value: '' })
  })

  it('handles "5*5 kaç eder" with numeric input', () => {
    expect(speechToMath('5*5 kaç eder')).toEqual({ type: 'expression', value: '5*5' })
  })
})
