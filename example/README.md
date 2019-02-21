# crudql example

Let's first imagine you have a model like [this](schema/thing.graphql).

This is the full type definition, but `createdAt` and `updatedAt` are special, and will be set in the resolvers, on the server-side. `id: ID!` is required for models to reference each other. I import my `scalars`, so I can use them.


#### boilerplate

Let's get our project all setup for ourselves:

```bash
# basic npm project
npm init -y

# install some deps we will be using for the server
npm i -S graphql graphql-custom-types graphql-type-json express apollo-server-express require-glob @crudql/dynamo@latest

# your typeDefs & resolvers will go here
mkdir schema resolvers

# setup some demo-models
git clone git@github.com:konsumer/crudql.git ~/Desktop/crudql
cp ~/Desktop/crudql/example/schema/scalars.graphql ~/Desktop/crudql/example/schema/thing.graphql ~/Desktop/crudql/example/schema/user.graphql schema/
cp ~/Desktop/crudql/example/resolvers/scalars.js resolvers/
cp ~/Desktop/crudql/example/server.js ~/Desktop/crudql/example/setup.js .
```

Now you have this file-structure:
```
package.json
server.js
setup.js
schema/
  scalars.graphql
  thing.graphql
  user.graphql
resolvers/
  scalars.js
```

#### making the CRUD

So first, I want to generate some CRUD schema-definitions:

```bash
crudql schema schema/thing.graphql Thing
crudql schema schema/user.graphql User
```

This gives us a full CRUD API schema-definition!

Next I want some DynamoDB resolvers:

```bash
crudql dynamo schema/thing.graphql Thing
crudql dynamo schema/user.graphql User
```

This will resolve everything. You can use `@crudql/dynamo` functions in your own resolvers, if you want, too. They return Promises, so they should be pretty easy to repurpose, however you like.

#### server & setup

Have a look at `server.js` and `setup.js`, and feel free to customize them however you like.

I made a [couple `run` scripts in `package.json`](./package.json) that you can have a look at:

* `start` - `node server.js` - starts local graphql server on port 3000
* `setup` - `node setup.js` - asks you some questions and sets up your tables in dynamo

Run `node setup.js`, then `node server.js` and you can visit your server at [http://localhost:3000/graphql](http://localhost:3000/graphql).
