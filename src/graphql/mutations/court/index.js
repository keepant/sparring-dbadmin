import gql from 'graphql-tag';

export const addCourtFacility = gql`
  mutation addCourtFacility($name: String!) {
    insert_court_facilities(objects: { name: $name }) {
      returning {
        id
        name
        created_at
      }
    }
  }
`;
