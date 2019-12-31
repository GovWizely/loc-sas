export function replaceNonIso8895 (v) {
  if (v != null) {
    // https://www.regextester.com/94294
    // ø!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£€¥Š§š©ª«¬®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ
    const invalidCharacters = v.replace(/[\x20-\x7E\xA0-\xA3\xA5\xA7\xA9-\xB3\xB5-\xB7\xB9-\xBB\xBF-\xFF\u20AC\u0160\u0161\u017D\u017E\u0152\u0153\u0178]*/, '')
    if (invalidCharacters.length > 0) {
      for (var i = 0; i < invalidCharacters.length; i++) {
        v = v.replace(invalidCharacters[i], '')
      }
    }
  }

  return v
}
