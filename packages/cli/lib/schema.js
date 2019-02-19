const { pluralize } = require('inflection')
const { basename } = require('path')

// TODO: this could probly be simplified
const getInputFields = (type, passRequired) => {
  return Object.values(type._fields).filter(f => {
    const plainType = f.type.toString().replace('!', '').replace('[', '').replace(']', '')
    // these are special & server-side
    if (plainType === 'DateTime' && (f.name === 'createdAt' || f.name === 'updatedAt')) {
      return false
    }
    if (f.name === 'id' && plainType === 'ID') {
      return false
    }
    return true
  }).map(f => {
    // handle required & arrays
    if (f.type.constructor.name === 'GraphQLNonNull' || f.type.constructor.name === 'GraphQLList') {
      let type
      if (f.type.ofType.constructor.name === 'GraphQLObjectType' || (f.type.ofType.ofType && f.type.ofType.ofType.constructor.name === 'GraphQLObjectType')) {
        type = f.type.toString().replace(/[A-Za-z]+/, 'ID')
        if (!passRequired) {
          type = type.replace(/\]!/, ']')
          if (type.indexOf(']') === -1) {
            type = type.replace(/!/g, '')
          }
        }
      } else {
        if (f.type.ofType.ofType && f.type.ofType.ofType.ofType) {
          type = f.type.toString().replace(f.type.ofType.ofType.ofType.name, 'ID')
          if (!passRequired) {
            type = type.replace(/\]!/, ']')
          }
        } else {
          type = passRequired ? f.type : f.type.toString().replace(/!/g, '')
        }
      }
      return `${f.name}: ${type}`

    // handle single object
    } else if (f.type.constructor.name === 'GraphQLObjectType') {
      return `${f.name}: ID`

    // handle everything else
    } else {
      if (f.type.ofType) {
        return `${f.name}: ${(passRequired ? f.type : f.type.toString().replace('!', '')).replace(f.type.ofType.name, 'ID')}`
      }
      return `${f.name}: ${passRequired ? f.type : f.type.toString().replace('!', '')}`
    }
  }).join('\n  ')
}

module.exports = (type, file) => `# import ${type.name} from "${file ? basename(file) : type.name.toLowerCase() + '.graphql'}"

type Query {
  # Get all ${pluralize(type.name)}.
  list${pluralize(type.name)}(pageStart: Int = 0, pageSize: Int = 100): [${type.name}]!
  
  # Get a single ${type.name}.
  get${type.name}(id: ID!): ${type.name}!
}  

type Mutation {
  # Update an existing ${type.name}.
  update${type.name}(${type.name}Update): ${type.name}!
  
  # Create a new ${type.name}.
  create${type.name}(${type.name}New): ${type.name}!
}

input ${type.name}Update {
  id: ID!
  ${getInputFields(type)}
}

input ${type.name}New {
  ${getInputFields(type, true)}
}
`
