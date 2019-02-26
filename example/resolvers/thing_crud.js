const { list, get, update, create, remove, reference } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listThings: list,
    getThing: get
  },
  Mutation: {
    updateThing: update,
    createThing: create,
    deleteThing: remove
  },
  Thing: {
    users: reference,
    owner: reference,
    controls: reference
  }
}
