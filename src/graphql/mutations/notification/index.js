import gql from 'graphql-tag';

export const addNotification = gql`
  mutation addNotification(\$title: String!, \$content: String!, \$app: String!){
    insert_notifications(objects: { title: \$title, content: \$content, app: \$app }) {
      returning {
        id
        title
        content
        created_at
        app
      }
    }
  }
`;
