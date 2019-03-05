import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { ButtonModal } from '@crudql/reactstrap'

const queryListUsers = gql`
  ListUsers{
    listUsers {
      id,
      email,
      createdAt,
      updatedAt
    }
  }
`

const mutationDeleteUser = gql`
  mutation DeleteUser($id: ID!){
    deleteUser(id: $id){
      id
    }
  }
`

const mutationUpdateUser = gql`
  mutation UpdateUser($input: UserUpdate){
    updateUser(input: $input){
      id
    }
  }
`

const mutationCreateUser = gql`
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

export const ButtonNew = ({ item }) => {
  return (
    <Mutation mutation={mutationCreateUser}>
      {({ mutate }) => (
        <ButtonModal className='bmd-btn-fab' color='success' title='Create User' content={<FormUser />} onComplete={() => mutate({ variables: { input: item } })}>
          <i className='material-icons'>add</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ButtonEdit = ({ item }) => {
  return (
    <Mutation mutation={mutationUpdateUser}>
      {({ mutate }) => (
        <ButtonModal color='primary' title='Edit User' content={<FormUser item={item} />} onComplete={() => mutate({ variables: { input: item } })}>
          <i className='material-icons'>edit</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ButtonDelete = ({ item }) => {
  return (
    <Mutation mutation={mutationDeleteUser}>
      {({ mutate }) => (
        <ButtonModal color='danger' title='Delete User' content='Are you sure you want to delete this User?' onComplete={() => mutate({ variables: { id: item.id } })}>
          <i className='material-icons'>delete</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ListUsers = () => (
  <Query query={queryListUsers}>
    {({ data, loading }) => !loading && (
      <table>
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
            <tr>
              <td>{d.id}</td>
              <td>{d.email}</td>
              <td>{d.createdAt}</td>
              <td>{d.updatedAt}</td>
              <td>
                <ButtonDelete item={d} />
                <ButtonEdit item={d} />
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    )}
  </Query>
)
