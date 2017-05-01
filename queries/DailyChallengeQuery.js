import gql from 'graphql-tag';

export default gql`
  query DailyChallengeQuery($currentUserId: String!) {
    user(id: $currentUserId) {
      id
      dailyChallengeInfo {
        incomingRequests {
          id
          partner(userId: $currentUserId) {
            id
          }
        }
        outgoingRequests {
          id
          partner(userId: $currentUserId) {
            id
          }
        }
        games {
          id
          word
          isCluer(userId: $currentUserId)
          clues
          guesses
          replayed
          lastUpdated
        }
      }
    }
  }
`;
