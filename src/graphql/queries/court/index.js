import gql from 'graphql-tag';

export const getCourtFacilities = gql`
  query getCourtFacilities{
    court_facilities (order_by: {created_at: desc}){
      id
      name
      created_at
    }
  }
`;
