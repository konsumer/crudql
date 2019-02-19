const { pluralize, foreign_key } = require('inflection')

const getIndexes = type => {
  const out = new Set(Object.values(type._fields).map(f => {
    const plainType = f.type.toString().replace('!', '').replace('[', '').replace(']', '')
    if (plainType === 'ID' && f.name === 'id') {
      return 'id'
    } else if (
      f.type.constructor.name === 'GraphQLObjectType' ||
      (f.type.constructor.name === 'GraphQLNonNull' && f.type.ofType.constructor.name === 'GraphQLObjectType') ||
      (f.type.constructor.name === 'GraphQLNonNull' && f.type.ofType.constructor.name === 'GraphQLList' && f.type.ofType.ofType.constructor.name === 'GraphQLObjectType')
    ) {
      return `${f.name}_${foreign_key(plainType)}`
    }
  }))
  return JSON.stringify([...out].filter(f => f))
}

module.exports = (type, file) => `
const { list, get, update, create, setup } = require('@crudql/dynamo')

module.exports = {
  Query: {
    list${pluralize(type.name)}: list,
    get${type.name}: get
  },
  
  Mutation: {
    update${type.name}: update,
    create${type.name}: create
  },
  
  _setup: setup({ name: '${pluralize(type.name)}', indexes: ${getIndexes(type)} })
}
`
