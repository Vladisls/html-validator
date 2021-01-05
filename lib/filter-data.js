module.exports = function (data, ignore) {
  const list = data.split('\n')
  const filters = Array.isArray(ignore) ? ignore : [ignore]
  const stringFilters = filters.filter(item => !(item instanceof RegExp))
  const regexFilters = filters.filter(item => item instanceof RegExp)
  let errors = false
  const results = []
  list.forEach(function (line, index) {
    let matchesAFilter = false
    if (stringFilters.indexOf(line) !== -1) {
      matchesAFilter = true
    }

    regexFilters.forEach(filter => {
      if (filter.test(line)) {
        matchesAFilter = true
      }
    })

    if (matchesAFilter) {
      return
    }

    if (line.startsWith('Error') && stringFilters.indexOf(line) === -1) {
      results.push(line)
      results.push(list[index + 1])
      errors = true
    } else if (line.startsWith('The')) {
      results.push(line)
    }
  })
  return errors === true ? results.join('\n') : 'The document validates according to the specified schema(s).'
}
