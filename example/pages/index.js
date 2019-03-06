import React from 'react'

import { ListThings, ButtonNewThing } from '../components/CrudThing'
import { ListUsers, ButtonNewUser } from '../components/CrudUser'

export default () => (
  <div>
    <h2>Things</h2>
    <ButtonNewThing><i className='material-icons'>add</i></ButtonNewThing>
    <ListThings />
    <h2>Users</h2>
    <ButtonNewUser><i className='material-icons'>add</i></ButtonNewUser>
    <ListUsers />
  </div>
)
