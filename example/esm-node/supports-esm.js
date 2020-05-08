(async function () {
  try {
    await import('lodash')
    process.exit(0)
  } catch (err) {
    process.exit(1)
  }
})()
