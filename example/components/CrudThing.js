import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { ButtonModal } from '@crudql/reactstrap'
import { Table, ButtonGroup } from 'reactstrap'

export const queryGetThing = gql`
  query GetThing($id: ID!){
    getThing(id: $id) {
      id,
      title,
      extraInfo,
      users {
        id
      },
      owner,
      controls,
      createdAt,
      updatedAt
    }
  }
`

export const queryListThings = gql`
  query ListThings{
    listThings {
      id,
      title,
      extraInfo,
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

export const ButtonNewThing = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationCreateThing}>
      {({ mutate }) => (
        <ButtonModal
          title='Create Thing'
          content={<FormThing />} onComplete={() => mutate({ variables: { input: item } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ButtonEditThing = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationUpdateThing}>
      {({ mutate }) => (
        <ButtonModal
          title='Edit Thing'
          content={<FormThing item={item} />}
          onComplete={() => mutate({ variables: { input: item } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ButtonDeleteThing = ({ item, ...props }) => {
  return (
    <Mutation mutation={mutationDeleteThing}>
      {({ mutate }) => (
        <ButtonModal
          title='Delete Thing'
          content='Are you sure you want to delete this Thing?'
          onComplete={() => mutate({ variables: { id: item.id } })}
          {...props}
        />
      )}
    </Mutation>
  )
}

export const ListThings = () => (
  <Query query={queryListThings}>
    {({ data, loading }) => {
      if (loading) {
        return <div>Loading...</div>
      } else {
        if (!data || !data.listThings || !data.listThings.length) {
          return <div>No Things.</div>
        } else {
          const onCompleteDelete = () => {
            // you could put a redirect here or something.
            alert('Thing deleted.')
          }

          const onCompleteEdit = () => {
            // you could put a redirect here or something.
            alert('Thing saved.')
          }
          return (
            <Table>
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
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.title}</td>
                    <td>{d.extraInfo}</td>
                    <td>{d.users}</td>
                    <td>{d.owner}</td>
                    <td>{d.controls}</td>
                    <td>{d.createdAt}</td>
                    <td>{d.updatedAt}</td>
                    <td>
                      <ButtonGroup className='btn-group-fluid'>
                        <ButtonDeleteThing aria-label='Delete this Thing' onComplete={onCompleteDelete} item={d} outline color='danger' className='btn-sm'><i className='material-icons'>delete</i></ButtonDeleteThing>
                        <ButtonEditThing aria-label='Edit this Thing' onComplete={onCompleteEdit} item={d} outline color='secondary' className='btn-sm'><i className='material-icons'>edit</i></ButtonEditThing>
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
