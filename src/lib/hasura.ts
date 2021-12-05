import { GraphQLClient, gql } from 'graphql-request'

const endpoint = 'https://hasura.n8n.cuthanh.com/v1/graphql'

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': 'myadminsecretkey',
  },
})

export default graphQLClient