const { list, get, update, create } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listThings: list,
    getThing: get
  },

  Mutation: {
    updateThing: update,
    createThing: create
  },

  Thing: {
    // TODO: linked fields
  },

  _info: { 'name': 'Thing', 'indexes': ['id', 'users.User', 'owner.User', 'controls.User'] }
}
