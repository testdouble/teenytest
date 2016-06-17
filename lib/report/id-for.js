module.exports = function idFor (metadata) {
  if(!metadata.ancestorNames) {
    throw new Error('Unique IDs require ancestorNames (suites & tests)')
  }
  return metadata.ancestorNames.concat(metadata.name).join(':')
}
