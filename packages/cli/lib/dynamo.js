const { pluralize } = require('inflection')

const getIndexes = type => {
  return ''
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
  
  _setup: setup({ name: '${pluralize(type.name)}', indexes: [${getIndexes(type)}] })
}
`
