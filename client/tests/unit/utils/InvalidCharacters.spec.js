import { removeNonIso8895 } from '@/utils/InvalidCharacters'
import { expect } from 'chai'

describe('InvalidCharacters', () => {
  it('removes non-ISO8895-15 characters from strings', () => {
    expect(removeNonIso8895('ABCΔ')).to.eq('')
    expect(removeNonIso8895(true)).to.eq(true)
  })
})
