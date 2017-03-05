import gql from 'graphql-tag';

export default gql`
  query PossibleWordsQuery($cluerId: String!, $guesserId: String!) {
    possibleWords(cluerId: $cluerId, guesserId: $guesserId, numWords: 3)
  }
`;
