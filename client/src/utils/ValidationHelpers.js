const moment = require('moment')

export function empty (v) {
  return v === null || v === '' || v === undefined
}

export function mmddyyyy (v) {
  if (empty(v)) {
    return true
  }

  if (isNaN(v) || (v !== null && v.length < 8)) {
    return false
  }

  if (v !== null && v.length === 8) {
    return moment(v, 'MMDDYYYY')._isValid
  }
}

export function emptyStringToNull (v) {
  if (v === '') return null
  else return v
}
