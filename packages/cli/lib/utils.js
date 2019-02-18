const yargs = require('yargs')
const fs = require('fs')
const { promisify } = require('util')
const { buildSchema } = require('graphql')

const readFile = promisify(fs.readFile)

// Get a specific type definition from a GrapQL file
const getType = async (file, model) => {
  const schema = buildSchema((await readFile(file)).toString())
  const types = Object.keys(schema._typeMap).filter(k => k[0] !== '_' && schema._typeMap[k].astNode && schema._typeMap[k].astNode.kind === 'ObjectTypeDefinition')

  if (!model || types.indexOf(model) === -1) {
    yargs.showHelp()
    console.log('\n[model] can be one of these:')
    console.log(types.join('\n'))
    process.exit(1)
  }

  return schema._typeMap[model]
}

module.exports = { getType }
