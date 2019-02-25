#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')

const writeFile = promisify(fs.writeFile)

const { getType } = require('./lib/utils')
const schemaCommand = require('./lib/schema')
const dynamoCommand = require('./lib/dynamo')

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1)

  .command('schema <file> <model>', 'Generate GraphQL schema for basic CRUD', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The directory where this gets outputted, relative to the file',
      default: '../schema'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    const filename = path.join(path.resolve(path.dirname(file), output), model.toLowerCase() + '_crud.graphql')
    await writeFile(filename, schemaCommand(type, file))
    console.log(`Wrote file: ${filename}`)
  })

  .command('dynamo <file> <model>', 'Generate DynamoDB resolvers for basic CRUD schema', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The directory where this gets outputted, relative to the file',
      default: '../resolvers'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    const filename = path.join(path.resolve(path.dirname(file), output), model.toLowerCase() + '_crud.js')
    await writeFile(filename, dynamoCommand(type, file))
    console.log(`Wrote file: ${filename}`)
  })

  .command('reactstrap <file> <model>', 'Generate components in reactstrap for CRUD', yargs => {
    yargs.option('output', {
      alias: 'o',
      describe: 'The directory where this gets outputted, relative to the file',
      default: '../components'
    })
  }, async argv => {
    const { model, file, output } = argv
    const type = await getType(file, model)
    // code goes here
  })

  .command('show <file> <model>', 'Just shows the model', yargs => {}, async argv => {
    const { model, file } = argv
    const type = await getType(file, model)
    console.dir(type)
  })

  .argv
