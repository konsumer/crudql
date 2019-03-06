const { getTemplate, getLinked } = require('./utils')

const template = getTemplate(`${__dirname}/templates/dynamo.mustache`)

module.exports = (type, file) => {
  const imports = ['list', 'get', 'update', 'create', 'remove']
  const linked = getLinked(type)
  if (linked.length) {
    imports.push('reference')
  }
  return template({ ...type, linked, imports })
}
