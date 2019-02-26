const { pluralize } = require('inflection')

const getLinked = type => {
  return '// TODO: linked fields'
}

module.exports = (type, file) => `const { list, get, update, create, remove } = require('@crudql/dynamo')

module.exports = {
  Query: {
    list${pluralize(type.name)}: list,
    get${type.name}: get
  },
  
  Mutation: {
    update${type.name}: update,
    create${type.name}: create,
    delete${type.name}: remove
  },

  ${type.name}: {
    ${getLinked(type)}
  }
}
`
