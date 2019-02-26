const { pluralize } = require('inflection')

const getLinked = type => {
  let out = []

  Object.keys(type._fields).forEach(name => {
    const t = type._fields[name].type
    if (
      t.constructor.name === 'GraphQLObjectType' ||
      (t.ofType && t.ofType.constructor.name === 'GraphQLObjectType') ||
      (t.ofType && t.ofType.ofType && t.ofType.ofType.constructor.name === 'GraphQLObjectType')
    ) {
      out.push(`${name}: reference('${name}')`)
    }
  })

  return out
}

module.exports = (type, file) => {
  const imports = ['list', 'get', 'update', 'create', 'remove']
  const linked = getLinked(type)
  if (linked.length) {
    imports.push('reference')
  }
  return `const { ${imports.join(', ')} } = require('@crudql/dynamo')

module.exports = {
  Query: {
    list${pluralize(type.name)}: list,
    get${type.name}: get
  },
  Mutation: {
    update${type.name}: update,
    create${type.name}: create,
    delete${type.name}: remove
  }${linked.length ? `,
  ${type.name}: {
    ${linked.join(',\n    ')}
  }
` : '\n'
}}
`
}
