module.exports = function (error, passing) {
  process.exit(!error && passing ? 0 : 1)
}
