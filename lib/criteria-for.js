module.exports = function criteriaFor (locator) {
  var parts
  if (includes(locator, '#')) {
    parts = locator.split('#')
    return {
      glob: parts[0],
      name: parts[1]
    }
  } else if (includes(locator, ':')) {
    parts = locator.split(':')
    return {
      glob: parts[0],
      lineNumber: parts[1]
    }
  } else {
    return {
      glob: locator
    }
  }
}

function includes (stringOrArray, obj) {
  return stringOrArray.indexOf(obj) > -1
}
