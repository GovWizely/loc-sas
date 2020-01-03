import { formatPhoneNumber } from '@/utils/PhoneNumberFormatter'
import { expect } from 'chai'

describe('PhoneNumberFormatter', () => {
  it('returns a formatted phone number with 10 digits', () => {
    expect(formatPhoneNumber('4435551234')).to.eq('(443) 555 1234')
  })

  it('removes non numeric values prior to formatting', () => {
    expect(formatPhoneNumber('4435X551X234')).to.eq('(443) 555 1234')
  })

  it('returns a formatted phone number with 1 digit', () => {
    expect(formatPhoneNumber('4')).to.eq('(4')
  })

  it('returns a formatted phone number with 2 digits', () => {
    expect(formatPhoneNumber('44')).to.eq('(44')
  })

  it('returns a formatted phone number with 3 digits', () => {
    expect(formatPhoneNumber('443')).to.eq('(443')
  })

  it('returns a formatted phone number with 4 digits', () => {
    expect(formatPhoneNumber('4435')).to.eq('(443) 5')
  })

  it('returns a formatted phone number with 5 digits', () => {
    expect(formatPhoneNumber('44355')).to.eq('(443) 55')
  })

  it('returns a formatted phone number with 6 digits', () => {
    expect(formatPhoneNumber('443555')).to.eq('(443) 555')
  })

  it('returns a formatted phone number with 7 digits', () => {
    expect(formatPhoneNumber('4435551')).to.eq('(443) 555 1')
  })

  it('returns a formatted phone number with 8 digits', () => {
    expect(formatPhoneNumber('44355512')).to.eq('(443) 555 12')
  })

  it('returns a formatted phone number with 8 digits', () => {
    expect(formatPhoneNumber('44355512')).to.eq('(443) 555 12')
  })

  it('returns a formatted phone number with 9 digits', () => {
    expect(formatPhoneNumber('443555123')).to.eq('(443) 555 123')
  })

  it('returns a formatted phone number with 10 digits', () => {
    expect(formatPhoneNumber('4435551234')).to.eq('(443) 555 1234')
  })

  it('returns a formatted phone number with 10 digits and trincates the remaining digits', () => {
    expect(formatPhoneNumber('44355512345')).to.eq('(443) 555 1234')
  })
})
