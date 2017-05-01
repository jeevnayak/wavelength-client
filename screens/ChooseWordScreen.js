import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';

import {
  BackButton,
  Button,
} from '../ui/Button';
import GiveCluesScreen from './GiveCluesScreen';
import PartnershipQuery from '../queries/PartnershipQuery';
import PossibleWordsQuery from '../queries/PossibleWordsQuery';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  MediumText,
} from '../ui/Text';

class ChooseWordScreen extends Component {
  render() {
    const words = this.props.possibleWords.map((word) => (
      <Button key={word} text={word} onPress={() => this.chooseWord_(word)} />
    ));
    return <Screen>
      <BackButton navigator={this.props.navigator} />
      <MediumText>Choose a word to clue:</MediumText>
      {words}
    </Screen>;
  }

  async chooseWord_(word) {
    const resp = await this.props.createNewGame(
      this.props.cluerId, this.props.guesserId, word);
    this.props.navigator.replace({
      component: GiveCluesScreen,
      props: {
        currentUserId: this.props.currentUserId,
        gameId: resp.data.newGame.id
      }
    });
    this.props.refetch();
  }
}

const newGameMutation = gql`
  mutation newGame($cluerId: String!, $guesserId: String!, $word: String!) {
    newGame(cluerId: $cluerId, guesserId: $guesserId, word: $word) {
      id
      word
      isCluer(userId: $cluerId)
      clues
      guesses
      replayed
      lastUpdated
      partnership {
        id
      }
    }
  }
`;

export default compose(
  graphql(PossibleWordsQuery, {
    props: ({ ownProps, data: { loading, error, refetch, possibleWords } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      possibleWords: possibleWords,
    }),
  }),
  graphql(newGameMutation, {
    props: ({ ownProps, mutate }) => ({
      createNewGame: (cluerId, guesserId, word) => {
        return mutate({
          variables: { cluerId, guesserId, word },
          update: (proxy, { data: { newGame } }) => {
            const queryVariables = {
              partnershipId: newGame.partnership.id,
              currentUserId: ownProps.currentUserId,
            };
            try {
              const data = proxy.readQuery({
                query: PartnershipQuery,
                variables: queryVariables,
              });
              data.partnership.games.unshift(newGame);
              proxy.writeQuery({
                query: PartnershipQuery,
                variables: queryVariables,
                data,
              });
            } catch (e) {
              // no-op
            }
          },
        });
      }
    }),
  }),
  screen
)(ChooseWordScreen);
