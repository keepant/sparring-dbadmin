import gql from 'graphql-tag';

export const getNotification = gql`
  query getNotification{
    notifications(where: {segment:{_eq: "all"}} order_by: { created_at: desc }) {
      id
      title
      content
      created_at
      app
    }
  }
`;
