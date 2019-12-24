export function formatPhoneNumber (phoneNumber) {
  if (!phoneNumber) {
    return ''
  }
  let tmpPhoneNumber = phoneNumber.replace(/\D/g, '')

  if (tmpPhoneNumber.length === 0) {
    return ''
  }

  if (tmpPhoneNumber.length <= 3) {
    return '(' + tmpPhoneNumber
  } else if (tmpPhoneNumber.length === 3) {
    return '(' + tmpPhoneNumber + ') '
  } else if (tmpPhoneNumber.length > 3 && tmpPhoneNumber.length <= 6) {
    return '(' + tmpPhoneNumber.substring(0, 3) + ') ' + tmpPhoneNumber.substring(3, 6)
  } else if (tmpPhoneNumber.length > 6 && tmpPhoneNumber.length <= 10) {
    return '(' + tmpPhoneNumber.substring(0, 3) + ') ' + tmpPhoneNumber.substring(3, 6) + ' ' + tmpPhoneNumber.substring(6, 10)
  }
}

export function isValidPhoneNumber (value) {
  if (value) {
    return value.replace(/\D/g, '').length === 10
  } else {
    return false
  }
}
