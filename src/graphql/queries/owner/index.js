import gql from 'graphql-tag';

export const getAllOwners = gql`
  query getAllOwners {
    owners(
      where: { account_status: { _neq: "not" } }
      order_by: { created_at: desc }
    ) {
      id
      name
      email
      username
      sex
      phone_number
      profile_picture
      address
      account_status
      created_at
      owner_doc {
        id
        id_card
        photo
        selfie_with_id
      }
    }
  }
`;
