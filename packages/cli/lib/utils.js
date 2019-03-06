const Handlebars = require('handlebars')
const { readFileSync } = require('fs')
const { pluralize } = require('inflection')

// return a list of fields, with indent
Handlebars.registerHelper('listFields', (fields, indent = 0) => fields.map(f => f.name.value).join(`,\n${'  '.repeat(indent)}`))

// return plural of string
Handlebars.registerHelper('plural', word => pluralize(word))

// join an array into a string
Handlebars.registerHelper('join', (strings, seperator) => strings.join(seperator))

// get a template function from a file
const getTemplate = (file) => Handlebars.compile(readFileSync(file).toString())

// get fields for a linked type (for field-resolvers)
const getLinked = type => {
  let out = []

  Object.keys(type._fields).forEach(name => {
    const t = type._fields[name].type
    if (
      t.constructor.name === 'GraphQLObjectType' ||
      (t.ofType && t.ofType.constructor.name === 'GraphQLObjectType') ||
      (t.ofType && t.ofType.ofType && t.ofType.ofType.constructor.name === 'GraphQLObjectType')
    ) {
      out.push(`${name}: reference`)
    }
  })

  return out
}

// get fields for input/update type
// TODO: this could probly be simplified
const getInputFields = (type, passRequired) => {
  return Object.values(type._fields).filter(f => {
    const plainType = f.type.toString().replace('!', '').replace('[', '').replace(']', '')
    // these are special & server-side
    if (plainType === 'DateTime' && (f.name === 'createdAt' || f.name === 'updatedAt')) {
      return false
    }
    if (f.name === 'id' && plainType === 'ID') {
      return false
    }
    return true
  }).map(f => {
    // handle required & arrays
    if (f.type.constructor.name === 'GraphQLNonNull' || f.type.constructor.name === 'GraphQLList') {
      let type
      if (f.type.ofType.constructor.name === 'GraphQLObjectType' || (f.type.ofType.ofType && f.type.ofType.ofType.constructor.name === 'GraphQLObjectType')) {
        type = f.type.toString().replace(/[A-Za-z]+/, 'ID')
        if (!passRequired) {
          type = type.replace(/\]!/, ']')
          if (type.indexOf(']') === -1) {
            type = type.replace(/!/g, '')
          }
        }
      } else {
        if (f.type.ofType.ofType && f.type.ofType.ofType.ofType) {
          type = f.type.toString().replace(f.type.ofType.ofType.ofType.name, 'ID')
          if (!passRequired) {
            type = type.replace(/\]!/, ']')
          }
        } else {
          type = passRequired ? f.type : f.type.toString().replace(/!/g, '')
        }
      }
      return `${f.name}: ${type}`

    // handle single object
    } else if (f.type.constructor.name === 'GraphQLObjectType') {
      return `${f.name}: ID`

    // handle everything else
    } else {
      if (f.type.ofType) {
        return `${f.name}: ${(passRequired ? f.type : f.type.toString().replace('!', '')).replace(f.type.ofType.name, 'ID')}`
      }
      return `${f.name}: ${passRequired ? f.type : f.type.toString().replace('!', '')}`
    }
  }).join('\n  ')
}

module.exports = { getTemplate, getLinked, getInputFields }
