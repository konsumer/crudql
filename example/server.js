// this uses .env to setup your environment
require('dotenv').config()
const AWS = require('aws-sdk')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const resolvers = mergeResolvers(fileLoader(`${__dirname}/resolvers/**/*.js`))
const typeDefs = mergeTypes(fileLoader(`${__dirname}/schema/**/*.graphql`), { all: true })

// this is just used for creating indexes
delete resolvers._info

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
})

const app = express()
server.applyMiddleware({ app })

app.listen(3000)
console.log('GraphQL server running at http://localhost:3000/graphql')
