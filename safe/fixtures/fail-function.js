module.exports = {
  'raw error': function () {
    throw 'raw' // eslint-disable-line
  },
  'error object': function () {
    throw new Error('wrapped')
  }
}
