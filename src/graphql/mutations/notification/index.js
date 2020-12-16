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

export const sendVerifyNotif = gql`
  mutation addNotification(\$title: String!, \$content: String!, \$segment: String!){
    insert_notifications(objects: { title: \$title, content: \$content, app: "owner", segment: \$segment }) {
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
