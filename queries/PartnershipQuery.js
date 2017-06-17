import gql from 'graphql-tag';

export default gql`
  query PartnershipQuery($partnershipId: Int!, $currentUserId: String!) {
    partnership(id: $partnershipId) {
      id
      partner(userId: $currentUserId) {
        id
        name
        firstName
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
      averageScore
    }
  }
`;
