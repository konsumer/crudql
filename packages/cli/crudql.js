#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const { importSchema } = require('graphql-import')
const { buildSchema } = require('graphql')

const writeFile = promisify(fs.writeFile)

const schemaCommand = require('./lib/schema')
const dynamoCommand = require('./lib/dynamo')
const reactstrapCommand = require('./lib/reactstrap')


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

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1)

  .command('schema <file> <model>', 'Generate GraphQL schema for basic CRUD', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The filename to output, relative to the model-file',
      default: '../schema/{NAME}_crud.graphql'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    const filename = path.resolve(path.dirname(file), output).replace('{NAME}', model.toLowerCase())
    await writeFile(filename, schemaCommand(type, file))
    console.log(`Wrote file: ${filename}`)
  })

  .command('dynamo <file> <model>', 'Generate DynamoDB resolvers for basic CRUD schema', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The filename to output, relative to the model-file',
      default: '../resolvers/{NAME}_crud.js'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    const filename = path.resolve(path.dirname(file), output).replace('{NAME}', model.toLowerCase())
    await writeFile(filename, dynamoCommand(type, file))
    console.log(`Wrote file: ${filename}`)
  })

  .command('reactstrap <file> <model>', 'Generate components in reactstrap for CRUD', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The filename to output, relative to the model-file',
      default: '../components/CRUD_{NAME}.js'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    const filename = path.resolve(path.dirname(file), output).replace('{NAME}', model)
    await writeFile(filename, reactstrapCommand(type, file))
    console.log(`Wrote file: ${filename}`)
  })

  .command('show <file> <model>', 'Just shows the model', yargs => {}, async argv => {
    const { model, file } = argv
    const type = await getType(file, model)
    console.dir(type)
  })
  .argv
