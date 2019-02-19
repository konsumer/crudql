# crudql

I wanted a simple way to build CRUD GraphQL APIs and frontends.

## installation

If you want to install it globally:

```bash
npm i -g @crudql/cli
``` 

If you want to use it without installing, just replace all uses of `crudql` with `npx  @crudql/cli`, in instructions below.

## usage

It will do more later, but my immediate needs were that I wanted to generate a CRUD API, that runs on an efficiently-keyed dynamo table, from a model-definition in GrapQL.

You can get help with this:

```bash
crudql --help
```


### scalars

I have a few useful scalars you should probly add to your server:

```graphql
scalar Json
scalar DateTime
scalar Email
scalar URL
```

The resolvers for this looks like this:

```js
const JSONType = require('graphql-type-json')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime
} = require('graphql-custom-types')

module.exports = {
  Json: JSONType,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  URL: GraphQLURL
}
```

You should put these (or something similar) in your code, if you want to use them (especially `DateTime` which I automatically use for `createdAt` and `updatedAt`.)

### example

Let's say I have a model like this:

```graphql
type Thing {
  id: ID!
  
  # the title of this Thing
  title: String!
  
  # extra info about this Thing
  extraInfo: String

  # when was this created?
  createdAt: DateTime!

  # when was this last updated?
  updatedAt: DateTime!
}
```

This is the full type definition, but `createdAt` and `updatedAt` are special, and will be set in the resolvers, on the server-side. `id: ID!` is required for models to reference each other.


#### boilerplate

Let's get our project all setup for ourselves:

```bash
# basic npm project
npm init -y

# install some deps we will be using for the server
npm i -S graphql-custom-types graphql-type-json @crudql/dynamo express apollo-server-express

# your typeDefs will go here
mkdir schema

# your resolvers will go here
mkdir resolvers

# your basic scalar typeDefs
echo <<< EOF
scalar Json
scalar DateTime
scalar Email
scalar URL
EOF > schema/scalars.graphql

# your basic scalar resolvers
echo <<< EOF
const JSONType = require('graphql-type-json')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime
} = require('graphql-custom-types')

module.exports = {
  Json: JSONType,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  URL: GraphQLURL
}
EOF > resolvers/scalars.js

# define your first type
echo <<< EOF
# import DateTime from "scalars.graphql"

type Thing {
  id: ID!
  
  # the title of this Thing
  title: String!
  
  # extra info about this Thing
  extraInfo: String

  # when was this created?
  createdAt: DateTime!

  # when was this last updated?
  updatedAt: DateTime!
}
EOF > schema/thing.graphql

```

#### making the CRUD

So first, I want to generate some CRUD schema definition:

```bash
crudql schema schema/thing.graphql Thing > schema/thing_crud.graphql
```

Which will make a file that looks like this:

```graphql
# import Thing from "thing.graphql"

type Query {
  # Get all Things.
  listThings(pageStart: Int = 0, pageSize: Int = 100): [Thing]!

  # Get a single Thing.
  getThing(id: ID!): Thing!
}

type Mutation {
  # Update an existing Thing.
  updateThing(ThingUpdate): Thing!

  # Create a new Thing.
  createThing(ThingNew): Thing!
}

input ThingUpdate {
  id: ID!
  title: String
  extraInfo: String
}

input ThingNew {
  title: String!
  extraInfo: String
}
```


This gives us a full CRUD API. Next I want a DynamoDB resolver:

```bash
crudql dynamo schema/thing.graphql Thing > resolvers/thing.js
```

Which will make a file that looks like this:

```js
const { list, get, update, create, setup } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listThings: list,
    getThing: get
  },
  Mutation: {
    updateThing: update,
    createThing: create
  },
  
  _setup: setup({ name: 'Things', indexes: ["id"] })
}
```

This will resolve everything, and has an unexposed function `_setup` that will actually set the model & it's indexes up for you, on Dynamo. You can use `@crudql/dynamo` functions in your own resolvers, if you want, too:

```js
const { list, get, update, create, setup } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listThings: async (current, args, context, info) => {
      const things = await list(current, args, context, info)
      // do stuff to things
      return things
    },
    getThing: get
  },
  Mutation: {
    updateThing: update,
    createThing: create
  },
  
  _setup: setup({ name: 'Thing', indexes: ["id"] })
}
```

#### creating the server

Now that you have your CRUD all setup, you can make a server that looks like this in `index.js`:

```js
const { importSchema } = require('graphql-import')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const resolvers = require('./resolvers/thing')
const typeDefs = importSchema('./schema/thing_crud.graphql')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
})

const app = express()
server.applyMiddleware({ app })
app.listen(3000)

```

#### setup

Make yourself a lil setup tool in `setup.js`:

```js
const { _setup } = require('./resolvers/thing')

_setup()
```

Run your setup tool to build your structure in dynamodb:

```bash
node setup.js
```

Run your server:

```bash
node index.js
```

Now, you can visit your server at [http://localhost:3000/graphql](http://localhost:3000/graphql).

### TODO: explain lodash.merge and merge-graphql-schemas for stitching together multiple resolvers & typeDefs

