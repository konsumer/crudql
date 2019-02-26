const { list, get, update, create, remove } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listUsers: list,
    getUser: get
  },
  
  Mutation: {
    updateUser: update,
    createUser: create,
    deleteUser: remove
  },

  User: {
    // TODO: linked fields
  }
}
