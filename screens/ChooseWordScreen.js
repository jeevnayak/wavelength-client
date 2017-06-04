import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  BackButton,
  Button,
} from '../ui/Button';
import {
  Card,
} from '../ui/Card';
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

const kWindowWidth = Dimensions.get("window").width;
const kCardHorizontalMargin = 50;
const kCardWidth = kWindowWidth - 2 * kCardHorizontalMargin;
const kCardsTop = 70;
const kCardsOffset = 80;
const kCardMaxRotation = 10;

class ChooseWordScreen extends Component {
  render() {
    const cards = this.props.possibleWords.map((word, i) => {
      const rotation = Math.random() * 2 * kCardMaxRotation - kCardMaxRotation;
      const style = {
        top: kCardsTop + i * kCardsOffset,
        transform: [{rotate: `${rotation}deg`}],
      };
      return <TouchableWithoutFeedback
          key={word}
          onPress={() => this.chooseWord_(word)}>
        <View style={[Styles.CardContainer, style]}>
          <Card
            word={word}
            clues={[]}
            width={kCardWidth}
            forceCorrect={true} />
        </View>
      </TouchableWithoutFeedback>;
    });
    return <Screen>
      <BackButton navigator={this.props.navigator} />
      <MediumText>Choose a word to clue:</MediumText>
      {cards}
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

const Styles = StyleSheet.create({
  CardContainer: {
    position: "absolute",
    left: kCardHorizontalMargin,
    width: kCardWidth,
  },
});

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
