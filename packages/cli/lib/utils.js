const Handlebars = require('handlebars')
const { readFileSync } = require('fs')
const { pluralize } = require('inflection')

// return a list of fields, with indent
Handlebars.registerHelper('listFields', (fields, indent = 0) => fields.map(f => f.name.value).join(`,\n${'  '.repeat(indent)}`))

// return plural of string
Handlebars.registerHelper('plural', word => pluralize(word))

// get a template function from a file
const getTemplate = (file) => Handlebars.compile(readFileSync(file).toString())

module.exports = { getTemplate }
