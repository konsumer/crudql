const Handlebars = require('handlebars')
const { readFileSync } = require('fs')
const { pluralize } = require('inflection')

// return a list of fields, with indent
Handlebars.registerHelper('listFields', (fields, indent=1) => fields.map(f => f.name).join(`,\n${'  '.repeat(indent)}`))

// return plural of string
Handlebars.registerHelper('plural', pluralize)

const getTemplate = (file) => Handlebars.compile(readFileSync(file))

module.exports = { getTemplate }
