import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { ButtonModal } from '@crudql/reactstrap'

export const queryGetThing = gql`
  GetThing($id: ID!){
    getThing(id: $id) {
      id,
      title,
      extraInfo,
      users,
      owner,
      controls,
      createdAt,
      updatedAt
    }
  }
`

export const queryListThings = gql`
  ListThings{
    listThings {
      id,
      title,
      extraInfo,
      users,
      owner,
      controls,
      createdAt,
      updatedAt
    }
  }
`

export const mutationDeleteThing = gql`
  mutation DeleteThing($id: ID!){
    deleteThing(id: $id){
      id
    }
  }
`

export const mutationUpdateThing = gql`
  mutation UpdateThing($input: ThingUpdate){
    updateThing(input: $input){
      id
    }
  }
`

export const mutationCreateThing = gql`
  mutation CreateThing($input: ThingNew){
    createThing(input: $input){
      id
    }
  }
`

export const FormThing = ({ item }) => {
  // TODO: form goes here
  return null
}

export const ButtonNew = ({ item }) => {
  return (
    <Mutation mutation={mutationCreateThing}>
      {({ mutate }) => (
        <ButtonModal className='bmd-btn-fab' color='success' title='Create Thing' content={<FormThing />} onComplete={() => mutate({ variables: { input: item } })}>
          <i className='material-icons'>add</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ButtonEdit = ({ item }) => {
  return (
    <Mutation mutation={mutationUpdateThing}>
      {({ mutate }) => (
        <ButtonModal color='primary' title='Edit Thing' content={<FormThing item={item} />} onComplete={() => mutate({ variables: { input: item } })}>
          <i className='material-icons'>edit</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ButtonDelete = ({ item }) => {
  return (
    <Mutation mutation={mutationDeleteThing}>
      {({ mutate }) => (
        <ButtonModal color='danger' title='Delete Thing' content='Are you sure you want to delete this Thing?' onComplete={() => mutate({ variables: { id: item.id } })}>
          <i className='material-icons'>delete</i>
        </ButtonModal>
      )}
    </Mutation>
  )
}

export const ListThings = () => (
  <Query query={queryListThings}>
    {({ data, loading }) => !loading && (
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>extraInfo</th>
            <th>users</th>
            <th>owner</th>
            <th>controls</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.listThings.map(d => (
            <tr>
              <td>{d.id}</td>
              <td>{d.title}</td>
              <td>{d.extraInfo}</td>
              <td>{d.users}</td>
              <td>{d.owner}</td>
              <td>{d.controls}</td>
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
