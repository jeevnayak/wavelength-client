import gql from 'graphql-tag';

export default gql`
  query GameQuery($gameId: Int!, $currentUserId: String!) {
    game(id: $gameId) {
      id
      word
      isCluer(userId: $currentUserId)
      clues
      guesses
      replayed
      lastUpdated
    }
  }
`;
