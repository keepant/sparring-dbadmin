import gql from 'graphql-tag';

export const getNotification = gql`
  query getNotification{
    notifications(order_by: { created_at: desc }) {
      id
      title
      content
      created_at
    }
  }
`;
