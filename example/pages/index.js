import React, { Fragment } from 'react'

import Page from '../components/Page'
import { ListThings, ButtonNewThing } from '../components/CrudThing'
import { ListUsers, ButtonNewUser } from '../components/CrudUser'

const onCompleteNewThing = () => {
  alert('New Thing added.')
}

const onCompleteNewUser = () => {
  alert('New User added.')
}

export default () => (
  <Page>
    <Fragment>
      <h2>Things</h2>
      <ButtonNewThing onComplete={onCompleteNewThing} className='btn-float btn-lg'><i className='material-icons'>add</i></ButtonNewThing>
      <ListThings />
      <hr />
      <h2>Users</h2>
      <ButtonNewUser onComplete={onCompleteNewUser} className='btn-float btn-lg'><i className='material-icons'>add</i></ButtonNewUser>
      <ListUsers />
    </Fragment>
  </Page>
)
