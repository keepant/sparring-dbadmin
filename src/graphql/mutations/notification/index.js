import gql from 'graphql-tag';

export const addNotification = gql`
  mutation addNotification(\$title: String!, \$content: String!){
    insert_notifications(objects: { title: \$title, content: \$content }) {
      affected_rows
    }
  }
`;
