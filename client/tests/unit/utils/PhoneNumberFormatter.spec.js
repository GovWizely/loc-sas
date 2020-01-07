import { formatPhoneNumber } from '@/utils/PhoneNumberFormatter'
import { expect } from 'chai'

describe('PhoneNumberFormatter', () => {
  it('returns a formatted phone number with 10 digits', () => {
    expect(formatPhoneNumber('4')).to.eq('(4')
    expect(formatPhoneNumber('44')).to.eq('(44')
    expect(formatPhoneNumber('443')).to.eq('(443')
    expect(formatPhoneNumber('4435')).to.eq('(443) 5')
    expect(formatPhoneNumber('44355')).to.eq('(443) 55')
    expect(formatPhoneNumber('443555')).to.eq('(443) 555')
    expect(formatPhoneNumber('4435551')).to.eq('(443) 555 1')
    expect(formatPhoneNumber('44355512')).to.eq('(443) 555 12')
    expect(formatPhoneNumber('44355512')).to.eq('(443) 555 12')
    expect(formatPhoneNumber('443555123')).to.eq('(443) 555 123')
    expect(formatPhoneNumber('4435551234')).to.eq('(443) 555 1234')
  })

  it('removes non numeric values prior to formatting', () => {
    expect(formatPhoneNumber('4435X551X234')).to.eq('(443) 555 1234')
  })

  it('returns a formatted phone number and truncates the remaining digits', () => {
    expect(formatPhoneNumber('44355512345')).to.eq('(443) 555 1234')
  })
})
