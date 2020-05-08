var _ = require('lodash')

function Dog (name) {
  this.name = name
}

Dog.prototype.bark = function (times) {
  return _.map(_.range(times), function (i) {
    return 'Woof #' + i
  })
}

Dog.prototype.tag = function (side) {
  if (side === 'front') {
    return 'Hi, I am ' + this.name
  } else {
    return 'And here is my address'
  }
}

module.exports = Dog
