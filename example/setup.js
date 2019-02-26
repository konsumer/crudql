const glob = require('glob').sync
const { setup } = require('@crudql/dynamo')
const path = require('path')

setup(
  glob(path.join(__dirname, 'schema/**/*.graphql'))
)
