import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { ButtonModal } from '@crudql/reactstrap'
import { Table, ButtonGroup } from 'reactstrap'

export const queryGetUser = gql`
  query GetUser($id: ID!){
    getUser(id: $id) {
      id,
      email,
      createdAt,
      updatedAt
    }
  }
`

export const queryListUsers = gql`
  query ListUsers{
    listUsers {
      id,
      email,
      createdAt,
      updatedAt
    }
  }
`

export const mutationDeleteUser = gql`
  mutation DeleteUser($id: ID!){
    deleteUser(id: $id){
      id
    }
  }
`

export const mutationUpdateUser = gql`
  mutation UpdateUser($input: UserUpdate){
    updateUser(input: $input){
      id
    }
  }
`

export const mutationCreateUser = gql`
  mutation CreateUser($input: UserNew){
    createUser(input: $input){
      id
    }
  }
`

export const FormUser = ({ item }) => {
  // TODO: form goes here
  return null
}

export const ButtonNewUser = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationCreateUser}>
      {({ mutate }) => (
        <ButtonModal
          title='Create User'
          content={<FormUser />} onComplete={() => mutate({ variables: { input: item } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ButtonEditUser = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationUpdateUser}>
      {({ mutate }) => (
        <ButtonModal 
          title='Edit User'
          content={<FormUser item={item} />}
          onComplete={() => mutate({ variables: { input: item } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ButtonDeleteUser = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationDeleteUser}>
      {({ mutate }) => (
        <ButtonModal
          title='Delete User'
          content='Are you sure you want to delete this User?'
          onComplete={() => mutate({ variables: { id: item.id } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ListUsers = () => (
  <Query query={queryListUsers}>
    {({ data, loading }) => {
      if (loading) {
        return <div>Loading...</div>
      } else {
        if (!data || !data.listUsers || !data.listUsers.length) {
          return <div>No Users.</div>
        } else {
          const onCompleteDelete = () => {
            // you could put a redirect here or something.
            alert('User deleted.')
          }

          const onCompleteEdit = () => {
            // you could put a redirect here or something.
            alert('User saved.')
          }
          return (
            <Table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>email</th>
                  <th>createdAt</th>
                  <th>updatedAt</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.listUsers.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.email}</td>
                    <td>{d.createdAt}</td>
                    <td>{d.updatedAt}</td>
                    <td>
                      <ButtonGroup className='btn-group-fluid'>
                        <ButtonDeleteUser aria-label='Delete this User' onComplete={onCompleteDelete} item={d} outline color='danger' className='btn-sm'><i className='material-icons'>delete</i></ButtonDeleteUser>
                        <ButtonEditUser aria-label='Edit this User' onComplete={onCompleteEdit} item={d} outline color='secondary' className='btn-sm'><i className='material-icons'>edit</i></ButtonEditUser>
                      </ButtonGroup>
                    </td>
                  </tr>
                )) }
              </tbody>
            </Table>
          )
        }
      }
    }}
  </Query>
)
