# crudql

I wanted a simple way to build CRUD GraphQL APIs and frontends.

## installation

If you want to install it globally:

```bash
npm i -g crudql
``` 

If you want to use it without installing, just replace all uses of `crudql` with `npx crudql`.

## usage

It will do more later, but my immediate needs were that I wanted to generate a CRUD API, that runs on dynamo, from a model-definition in GrapQL.

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

You should put these (or something similar) in your code, if you wan to use them (especially `DateTime` which I automatically use for `createdAt` and `updatedAt`.)

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


Let's get our project all setup for ourselves:

```bash
# basic npm project
npm init -y

# install some deps we will be using for the server
npm i -S crudql-resolvers-dynamo express merge-graphql-schemas apollo-server-express

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


So first, I want to generate some CRUD schema definition:

```bash
crudql schema schema/thing.graphql Thing > schema/thing_crud.graphql
```

Which will make a file that looks like this:

```graphql
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
module.exports = {
  Query: {
    listThings: (current, args, context, info) => {
      // TODO: once I work it out
    },

    getThing: (current, args, context, info) => {
      // TODO: once I work it out
    }
  },
  Mutation: {
    updateThing: (current, args, context, info) => {
      // TODO: once I work it out
    },

    createThing: (current, args, context, info) => {
      // TODO: once I work it out
    }
  },
  _setup: () => {
    // TODO: setup the actual models & indexes on dynamo here
  }
}
```

This will resolve everything, and has an unexposed function `_setup` that will actually set the model & it's indexes up for you, on Dynamo.

### building your server

**TODO**: put apollo-server-expree & merge-graphql-schemas instructions here
