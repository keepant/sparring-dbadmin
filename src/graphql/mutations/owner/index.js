import gql from 'graphql-tag';

export const verifyOwner = gql`
   mutation verifyOwner(\$id: String!){
    update_owners(
      where: { id: { _eq: \$id } }
      _set: { account_status: "verified" }
    ) {
      affected_rows
    }
  }
`;

export const notVerifyOwner = gql`
  mutation notVerifyOwner(\$id: String!){
    update_owners(
      where: { id: { _eq: \$id } }
      _set: { account_status: "not" }
    ) {
      affected_rows
    }
  }
`;
