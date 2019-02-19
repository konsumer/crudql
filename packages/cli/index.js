const schema = require('./lib/schema')
const dynamo = require('./lib/dynamo')
const { getType } = require('./lib/utils')

module.exports = { getType, schema, dynamo }
