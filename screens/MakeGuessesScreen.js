import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  StyleSheet,
} from 'react-native';

import {
  BackButton,
} from '../ui/Button';
import Card from '../ui/Card';
import GameQuery from '../queries/GameQuery';
import {
  screen,
  Screen,
} from '../ui/Screen';

class MakeGuessesScreen extends Component {
  state = {
    guesses: [""],
  };

  render() {
    const guessedWord = this.guessedWord_();
    const currentGuess = this.state.guesses[this.state.guesses.length - 1];
    const word = guessedWord ? this.props.game.word : currentGuess;
    const clues = guessedWord ?
      [...this.props.game.clues.slice(0, this.state.guesses.length - 1),
        currentGuess] :
      this.props.game.clues.slice(0, this.state.guesses.length);
    return <Screen style={Styles.Screen}>
      <BackButton navigator={this.props.navigator} />
      <Card
        word={word}
        clues={clues}
        focusedClueIndex={clues.length - 1}
        guessingWord={!guessedWord} />
      <Keyboard
        onPressLetter={(letter) => this.onPressLetter_(letter)}
        onPressBackspace={() => this.onPressBackspace_()}
        onPressSubmit={() => this.onPressSubmit_()} />
    </Screen>;
  }

  guessedWord_() {
    return this.state.guesses.some((guess, i) => (
      i !== this.state.guesses.length - 1 && guess === this.props.game.word
    ));
  }

  onPressLetter_(letter) {
    this.state.guesses[this.state.guesses.length - 1] += letter;
    this.setState({guesses: this.state.guesses});
  }

  onPressBackspace_() {
    let currentGuess = this.state.guesses[this.state.guesses.length - 1];
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    this.state.guesses[this.state.guesses.length - 1] = currentGuess;
    this.setState({guesses: this.state.guesses});
  }

  onPressSubmit_() {
    if (this.state.guesses.length === 4) {
      this.makeGuesses_();
    } else {
      this.setState({guesses: [...this.state.guesses, ""]});
    }
  }

  async makeGuesses_() {
    await this.props.makeGuesses(this.state.guesses);
    this.props.navigator.pop();
  }
}

const Styles = StyleSheet.create({
  Screen: {
    justifyContent: "space-between",
  },
});

const makeGuessesMutation = gql`
  mutation makeGuesses(
      $currentUserId: String!, $gameId: Int!, $guesses: [String]!) {
    makeGuesses(gameId: $gameId, guesses: $guesses) {
      id
      word
      isCluer(userId: $currentUserId)
      clues
      guesses
      replayed
    }
  }
`;

export default compose(
  graphql(GameQuery, {
    props: ({ ownProps, data: { loading, error, refetch, game } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      game: game,
    }),
  }),
  graphql(makeGuessesMutation, {
    props: ({ ownProps, mutate }) => ({
      makeGuesses: (guesses) => {
        mutate({
          variables: {
            currentUserId: ownProps.currentUserId,
            gameId: ownProps.gameId,
            guesses: guesses
          }
        });
      }
    }),
  }),
  screen
)(MakeGuessesScreen);
