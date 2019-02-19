const yargs = require('yargs')
const { importSchema } = require('graphql-import')
const { buildSchema } = require('graphql')

// Get a specific type definition from a GrapQL file
const getType = async (file, model) => {
  const schema = buildSchema(importSchema(file))
  const types = Object.keys(schema._typeMap).filter(k => k[0] !== '_' && schema._typeMap[k].astNode && schema._typeMap[k].astNode.kind === 'ObjectTypeDefinition')

  if (!model || types.indexOf(model) === -1) {
    yargs.showHelp()
    console.error('\n[model] can be one of these:')
    console.error(types.join('\n'))
    process.exit(1)
  }

  return schema._typeMap[model]
}

module.exports = { getType }
