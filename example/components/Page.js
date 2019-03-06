// this is the main template/wrapper for all pages

import React, { Fragment } from 'react'
import Head from 'next/head'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import fetch from 'isomorphic-fetch'
import { Jumbotron, Container } from 'reactstrap'

const client = new ApolloClient({
  uri: '/graphql',
  fetch: fetch
})

export default ({ children }) => (
  <ApolloProvider client={client}>
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <link href='https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i|Roboto+Mono:300,400,700|Roboto+Slab:300,400,700' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet' />
        <link href='http://daemonite.github.io/material/css/material.min.css' rel='stylesheet' />
        <title>crudql example</title>
      </Head>
      <Jumbotron>
        <Container>
          <h1 className='display-3'>crudql example</h1>
        </Container>
      </Jumbotron>
      <Container id='content'>{children}</Container>
    </Fragment>
  </ApolloProvider>
)
