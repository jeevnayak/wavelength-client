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
import {
  FullScreenCard,
} from '../ui/Card';
import GameQuery from '../queries/GameQuery';
import {
  kLetterPlaceholder,
} from '../ui/Letters';
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
    const displayGuess = this.getDisplayGuess_();
    const word = guessedWord ? this.props.game.word : displayGuess;
    const clues = guessedWord ?
      [...this.props.game.clues.slice(0, this.state.guesses.length - 1),
        displayGuess] :
      this.props.game.clues.slice(0, this.state.guesses.length);
    return <Screen style={Styles.Screen}>
      <BackButton navigator={this.props.navigator} />
      <FullScreenCard
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

  getCurrentGuess_() {
    const currentGuessIndex = this.state.guesses.length - 1;
    return this.state.guesses[currentGuessIndex];
  }

  getCurrentTarget_() {
    const currentGuessIndex = this.state.guesses.length - 1;
    return this.guessedWord_() ?
      this.props.game.clues[currentGuessIndex] : this.props.game.word;
  }

  getDisplayGuess_() {
    const currentGuess = this.getCurrentGuess_();
    return currentGuess + kLetterPlaceholder.repeat(
      this.getCurrentTarget_().length - currentGuess.length);
  }

  onPressLetter_(letter) {
    if (this.getCurrentGuess_().length === this.getCurrentTarget_().length) {
      return;
    }
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
    if (this.getCurrentGuess_().length !== this.getCurrentTarget_().length) {
      return;
    }
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
