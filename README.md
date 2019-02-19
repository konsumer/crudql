# crudql

I wanted a simple way to build CRUD GraphQL APIs and frontends.

## installation

If you want to install it globally:

```bash
npm i -g @crudql/cli
``` 

If you want to use it without installing, just replace all uses of `crudql` with `npx  @crudql/cli`, in instructions below.

## usage

Check out [example](example) for a complete example, including the process I went through to make it.


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