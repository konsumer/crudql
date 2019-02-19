const { pluralize } = require('inflection')

const getIndexes = type => {
  const out = new Set(Object.values(type._fields).map(f => {
    const plainType = f.type.toString().replace('!', '').replace('[', '').replace(']', '')
    if (plainType === 'ID') {
      return f.name
    } else if (
      f.type.constructor.name === 'GraphQLObjectType' ||
      (f.type.constructor.name === 'GraphQLNonNull' && f.type.ofType.constructor.name === 'GraphQLObjectType') ||
      (f.type.constructor.name === 'GraphQLNonNull' && f.type.ofType.constructor.name === 'GraphQLList' && f.type.ofType.ofType.constructor.name === 'GraphQLObjectType')
    ) {
      return `${f.name}.${plainType}`
    }
  }))
  return [...out].filter(f => f)
}

const getLinked = type => {
  return '// TODO: linked fields'
}

module.exports = (type, file) => `const { list, get, update, create } = require('@crudql/dynamo')

module.exports = {
  Query: {
    list${pluralize(type.name)}: list,
    get${type.name}: get
  },
  
  Mutation: {
    update${type.name}: update,
    create${type.name}: create
  },

  ${type.name}: {
    ${getLinked(type)}
  },

  _info: ${JSON.stringify({ name: type.name, indexes: getIndexes(type) })}
}
`
