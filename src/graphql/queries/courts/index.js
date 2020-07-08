import gql from 'graphql-tag';

export const getCountUsers = gql`
  query getCountUsers {
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const getCountOwners = gql`
  query getCountOwners {
    owners_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const getCountNotVerifiedOwner = gql`
  query getCountNotVerifiedOwner {
    owners_aggregate(where: { _not: { account_status: { _eq: "verified" } } }) {
      aggregate {
        count
      }
    }
  }
`;

export const getCountVerifiedOwner = gql`
  query getCountVerifiedOwner{
    owners_aggregate(where: { account_status: { _eq: "verified" } }) {
      aggregate {
        count
      }
    }
  }
`;
