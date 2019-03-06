const { basename } = require('path')
const { getTemplate, getInputFields } = require('./utils')

const template = getTemplate(`${__dirname}/templates/schema.mustache`)

module.exports = (type, file) => {
  const filename = file ? basename(file) : type.name.toLowerCase() + '.graphql'
  return template({ ...type, filename, updateFields: getInputFields(type), inputFields: getInputFields(type, true) })
}
