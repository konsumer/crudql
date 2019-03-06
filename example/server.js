// this uses .env to setup your environment
require('dotenv').config()
const AWS = require('aws-sdk')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const next = require('next')

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const resolvers = mergeResolvers(fileLoader(`${__dirname}/resolvers/**/*.js`))
const typeDefs = mergeTypes(fileLoader(`${__dirname}/schema/**/*.graphql`), { all: true })

const aplloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
})

// This runs nextjs frontend & express app on port 3000
const nextApp = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = nextApp.getRequestHandler()
nextApp.prepare().then(() => {
  const app = express()
  aplloServer.applyMiddleware({ app })
  app.get('*', (req, res) => handle(req, res))
  app.listen(3000, err => {
    if (err) throw err
    console.log('Server running at http://localhost:3000/')
  })
})
