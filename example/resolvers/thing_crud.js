const { list, get, update, create, remove } = require('@crudql/dynamo')

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
    // TODO: linked fields
  }
}
