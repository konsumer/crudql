#!/usr/bin/env node

const yargs = require('yargs')

const { getType } = require('./lib/utils')
const schemaCommand = require('./lib/schema')

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1)
  .command('schema <file> [model]', 'Generate GraphQL schema for basic CRUD', yargs => {}, async argv => {
    const { model, file } = argv
    const type = await getType(file, model)
    console.log(schemaCommand(type))
  })
  .command('dynamo [file] [model]', 'Generate DynamoDB resolvers for basic CRUD schema', yargs => {})

  .argv