import gql from 'graphql-tag';

export const addCourtFacility = gql`
  mutation addCourtFacility(\$name: String!){
    insert_court_facilities(objects: { name: \$name }) {
      affected_rows
    }
  }
`;
