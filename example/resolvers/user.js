const { list, get, update, create } = require('@crudql/dynamo')

module.exports = {
  Query: {
    listUsers: list,
    getUser: get
  },

  Mutation: {
    updateUser: update,
    createUser: create
  },

  User: {
    // TODO: linked fields
  },

  _info: { 'name': 'User', 'indexes': ['id'] }
}
