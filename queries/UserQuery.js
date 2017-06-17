import gql from 'graphql-tag';

export default gql`
  query UserQuery($currentUserId: String!) {
    user(id: $currentUserId) {
      id
      name
      firstName
      lastName
      fbToken
      partnerships {
        id
        partner(userId: $currentUserId) {
          id
          name
        }
        averageScore
      }
    }
  }
`;
