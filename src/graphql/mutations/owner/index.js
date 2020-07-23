import gql from 'graphql-tag';

export const verifyOwner = gql`
  mutation verifyOwner(\$id: String!){
    update_owners_by_pk(
      pk_columns: { id: \$id }
      _set: { account_status: "verified" }
    ) {
      account_status
    }
  }
`;


export const notVerifyOwner = gql`
  mutation notVerifyOwner(\$id: String!){
    update_owners_by_pk(
      pk_columns: { id: \$id }
      _set: { account_status: "not" }
    ) {
      account_status
    }
  }
`;