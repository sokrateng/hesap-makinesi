import { describe, it, expect, beforeEach } from 'vitest'
import { setAns, getAns, clearAns, resolveAns } from './ansStore'

describe('ansStore', () => {
  beforeEach(() => {
    clearAns()
  })

  describe('getAns', () => {
    it('returns null when no value stored', () => {
      expect(getAns()).toBeNull()
    })

    it('returns stored value after setAns', () => {
      setAns('42')
      expect(getAns()).toBe('42')
    })
  })

  describe('setAns', () => {
    it('stores a string value', () => {
      setAns('3.14')
      expect(getAns()).toBe('3.14')
    })

    it('overwrites previous value', () => {
      setAns('10')
      setAns('20')
      expect(getAns()).toBe('20')
    })

    it('stores negative values', () => {
      setAns('-5')
      expect(getAns()).toBe('-5')
    })
  })

  describe('clearAns', () => {
    it('clears stored value', () => {
      setAns('100')
      clearAns()
      expect(getAns()).toBeNull()
    })
  })

  describe('resolveAns', () => {
    it('returns expression unchanged when no Ans stored', () => {
      expect(resolveAns('Ans+1')).toBe('Ans+1')
    })

    it('replaces Ans with stored value in parentheses', () => {
      setAns('42')
      expect(resolveAns('Ans+1')).toBe('(42)+1')
    })

    it('replaces multiple Ans occurrences', () => {
      setAns('5')
      expect(resolveAns('Ans+Ans')).toBe('(5)+(5)')
    })

    it('does not replace lowercase ans', () => {
      setAns('10')
      expect(resolveAns('ans+1')).toBe('ans+1')
    })

    it('does not replace ANS', () => {
      setAns('10')
      expect(resolveAns('ANS+1')).toBe('ANS+1')
    })

    it('handles Ans at start of expression', () => {
      setAns('7')
      expect(resolveAns('Ans*2')).toBe('(7)*2')
    })

    it('handles Ans at end of expression', () => {
      setAns('3')
      expect(resolveAns('2+Ans')).toBe('2+(3)')
    })

    it('handles expression without Ans', () => {
      setAns('99')
      expect(resolveAns('2+3')).toBe('2+3')
    })

    it('wraps negative stored values in parentheses', () => {
      setAns('-8')
      expect(resolveAns('Ans+1')).toBe('(-8)+1')
    })

    it('handles Ans inside function calls', () => {
      setAns('9')
      expect(resolveAns('sqrt(Ans)')).toBe('sqrt((9))')
    })
  })
})
