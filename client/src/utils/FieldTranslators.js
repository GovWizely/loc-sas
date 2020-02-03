export function keysToSnake (o) {
  if (isObject(o)) {
    const n = {}

    Object.keys(o)
      .forEach((k) => {
        n[toSnake(k)] = keysToSnake(o[k])
      })

    return n
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToSnake(i)
    })
  }

  return o
}

export function keysToCamel (o) {
  if (isObject(o)) {
    const n = {}

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k])
      })

    return n
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i)
    })
  }

  return o
}

function toCamel (str) {
  return str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''))
}

function toSnake (str) {
  return str.replace(/[\w]([A-Z])/g, (m) => m[0] + '_' + m[1]).toLowerCase()
}

function isArray (a) {
  return Array.isArray(a)
}

function isObject (o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
}
