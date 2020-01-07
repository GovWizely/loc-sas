import { replaceNonIso8895 } from '@/utils/ISO8895-15validator'
import { expect } from 'chai'

describe('ISO8895-15validator', () => {
  it('removes non-ISO8895-15 characters from strings', () => {
    expect(replaceNonIso8895('ABCΔ')).to.eq('ABC')
    expect(replaceNonIso8895(true)).to.eq(true)
  })
})
