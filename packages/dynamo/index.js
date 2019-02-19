const chalk = require('chalk')
const { prompt } = require('enquirer')
const { tableize } = require('inflection')
const AWS = require('aws-sdk')
const colorize = require('json-colorizer')
const shortid = require('shortid').generate

const awsRegions = {
  'us-east-1': 'US East (N. Virginia)',
  'us-east-2': 'US East (Ohio)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'us-gov-east-1': 'AWS GovCloud (US-East)',
  'us-gov-west-1': 'AWS GovCloud (US)',
  'ap-south-1': 'Asia Pacific (Mumbai)',
  'ap-northeast-1': 'Asia Pacific (Tokyo)',
  'ap-northeast-2': 'Asia Pacific (Seoul)',
  'ap-northeast-3': 'Asia Pacific (Osaka-Local)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
  'ap-southeast-2': 'Asia Pacific (Sydney)',
  'ca-central-1': 'Canada (Central)',
  'cn-north-1': 'China (Beijing)',
  'cn-northwest-1': 'China (Ningxia)',
  'eu-central-1': 'EU (Frankfurt)',
  'eu-west-1': 'EU (Ireland)',
  'eu-west-2': 'EU (London)',
  'eu-west-3': 'EU (Paris)',
  'eu-north-1': 'EU (Stockholm)',
  'sa-east-1': 'South America (São Paulo)'
}

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const client = {
  list: (TableName, pageKey, pageSize) => db.scan(pageKey && pageSize ? { TableName, Limit: pageSize, ExclusiveStartKey: { S: pageKey } } : { TableName }).promise().then(r => r.Items || []),

  get: async (TableName, id) => {
    const items = await db.query({
      TableName,
      ExpressionAttributeValues: { ':id': id },
      KeyConditionExpression: 'id = :id'
    }).promise().then(r => r.Items)
    if (!items || !items[0]) {
      throw new Error('Not found.')
    }
    return items[0]
  },

  update: (TableName, Item, info) => {
    // TODO: use info to pull out linked records & update them
    Item.updatedAt = (new Date()).toISOString()
    return db.update({
      TableName,
      ReturnValues: 'ALL_NEW',
      ...handleUpdates(Item),
      Key: { id: Item.id }
    }).promise().then(r => r.Attributes)
  },

  create: (TableName, Item, info) => {
    Item.createdAt = (new Date()).toISOString()
    Item.updatedAt = Item.createdAt
    Item.id = shortid()
    return db.put({
      TableName,
      Item
    }).promise().then(r => Item)
  },

  remove: (TableName, id) => {
    // not implemented
  }
}

// generate query for updating record
const handleUpdates = updates => {
  const expression = []
  const ExpressionAttributeValues = {}
  Object.keys(updates).forEach(k => {
    if (k === 'id' || !updates[k] || updates[k] === '') {
      return
    }
    expression.push(`${k} = :${k}`)
    ExpressionAttributeValues[`:${k}`] = updates[k]
  })
  return { UpdateExpression: `set ${expression.join(', ')}`, ExpressionAttributeValues }
}

// get all records
const list = (current, args, context, info) => {
  const TableName = process.env[`TABLE_${info.returnType.ofType.ofType.name.toUpperCase()}`]
  const { pageKey, pageSize } = args
  return client.list(TableName, pageKey, pageSize)
}

// get a single record by ID
const get = (current, args, context, info) => {
  const TableName = process.env[`TABLE_${info.returnType.ofType.name.toUpperCase()}`]
  return client.get(TableName, args.id)
}

// update a sinfgle record
const update = (current, args, context, info) => {
  const TableName = process.env[`TABLE_${info.returnType.ofType.name.toUpperCase()}`]
  return client.update(TableName, args.input, info)
}

// create a new record
const create = (current, args, context, info) => {
  const TableName = process.env[`TABLE_${info.returnType.ofType.name.toUpperCase()}`]
  return client.create(TableName, args.input, info)
}

const remove = (current, args, context, info) => {
  const TableName = process.env[`TABLE_${info.returnType.ofType.name.toUpperCase()}`]
  return client.remove(TableName, args.id)
}

// initial dynamo settings
const initialSetup = async () => {
  console.log(chalk.bold('Database Setup\n'))
  const questions = [
    {
      type: 'select',
      name: 'AWS_REGION',
      message: 'What region do you want to deploy in?',
      default: awsRegions[process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1'],
      choices: Object.values(awsRegions)
    },
    {
      type: 'input',
      name: 'AWS_ACCESS_KEY_ID',
      message: `${chalk.yellow('AWS_ACCESS_KEY_ID')}?`,
      default: process.env.AWS_ACCESS_KEY_ID
    },
    {
      type: 'password',
      name: 'AWS_SECRET_ACCESS_KEY',
      message: `${chalk.yellow('AWS_SECRET_ACCESS_KEY')}?`,
      default: process.env.AWS_SECRET_ACCESS_KEY
    },
    {
      type: 'input',
      name: 'TABLE_PREFIX',
      message: 'Prefix for table-names?',
      default: process.env.TABLE_PREFIX || ''
    }
  ]
  const response = await prompt(questions)
  const AWS_REGION = Object.keys(awsRegions)[Object.values(awsRegions).indexOf(response.AWS_REGION)]
  const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, TABLE_PREFIX } = response
  return { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, TABLE_PREFIX }
}

// setup a dynamodb table
const setup = async (tableInfo, initialConfig, totalConfig, last) => {
  console.log('\n' + chalk.bold(tableInfo.name) + '\n')
  const questions = [
    {
      type: 'input',
      name: 'table',
      message: 'What is the name of the table?',
      default: initialConfig.TABLE_PREFIX + tableize(tableInfo.name)
    }
  ]
  const response = await prompt(questions)
  const env = { ...initialConfig, ...totalConfig }
  env[`TABLE_${tableInfo.name.toUpperCase()}`] = `${response.table}`
  env.keys[ tableInfo.name ] = tableInfo.indexes
  return env
}

// do actual config
const finishSetup = async (env, awsParams = {}) => {
  delete env.TABLE_PREFIX
  console.log('\nMake sure you have these set in your environment:\n')
  Object.keys(env).forEach(k => {
    if (k === 'keys') {
      return
    }
    if (k === 'AWS_SECRET_ACCESS_KEY') {
      console.log(`${chalk.green('AWS_SECRET_ACCESS_KEY')}="${chalk.yellow(env.AWS_SECRET_ACCESS_KEY.replace(/./g, '*'))}"`)
    } else {
      console.log(`${chalk.green(k)}=${chalk.yellow(JSON.stringify(env[k]))}`)
    }
  })
  console.log('')
  const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, keys, ...tables } = env
  AWS.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
  const allParams = []
  await Promise.all(Object.keys(tables).map(async t => {
    const TableName = tables[t]
    const params = {
      AttributeDefinitions: [],
      KeySchema: [],
      GlobalSecondaryIndexes: [],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName,
      StreamSpecification: {
        StreamEnabled: false
      },
      ...awsParams
    }
    const i = Object.keys(env.keys).find(k => t === `TABLE_${k.toUpperCase()}`)
    if (i) {
      const currentKeys = env.keys[i]
      if (currentKeys.find(k => k === 'id')) {
        params.AttributeDefinitions.push({ AttributeName: 'id', AttributeType: 'S' })
        params.KeySchema.push({ AttributeName: 'id', KeyType: 'HASH' })
        currentKeys.forEach(k => {
          if (k !== 'id') {
            const AttributeName = k.split('.')[0]
            params.AttributeDefinitions.push({ AttributeName, AttributeType: 'S' })
            params.GlobalSecondaryIndexes.push({
              IndexName: tableize(k).replace(/\./g, ''),
              KeySchema: [{
                AttributeName,
                KeyType: 'HASH'
              }],
              Projection: {
                'ProjectionType': 'ALL'
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            })
          }
        })
      }
    }
    if (params.KeySchema.length === 0) { delete params.KeySchema }
    if (params.GlobalSecondaryIndexes.length === 0) { delete params.GlobalSecondaryIndexes }
    if (params.AttributeDefinitions.length === 0) { delete params.AttributeDefinitions }
    allParams.push(params)
  }))
  console.log(colorize(JSON.stringify(allParams, null, 2)))
  const { confirm } = await prompt({
    type: 'confirm',
    name: 'confirm',
    message: 'Ready to do it?'
  })
  if (confirm) {
    await Promise.all(allParams.map(params => {
      console.log(`Creating ${chalk.inverse(params.TableName)} on AWS.`)
      return ddb.createTable(params).promise()
    }))
  } else {
    console.log('Cancelled.')
  }
}

module.exports = { list, get, update, create, setup, initialSetup, finishSetup, client, remove }
