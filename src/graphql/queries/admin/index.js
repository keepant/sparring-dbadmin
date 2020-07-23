import gql from 'graphql-tag';

export const getAdmin = gql`
  query getAdmin(\$id: String!){
    admin(where: { id: { _eq: \$id } }) {
      id
      name
      email
      username
      gender
      address
      role
      created_at
    }
  }
`;
