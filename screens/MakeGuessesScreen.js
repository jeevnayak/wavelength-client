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
  ExitButton,
} from '../ui/Button';
import {
  FullScreenCard,
} from '../ui/Card';
import GameQuery from '../queries/GameQuery';
import {
  getScore,
  isGuessCorrect,
} from '../util/Helpers';
import {
  Event,
  logEvent,
} from '../util/Logging';
import PartnershipQuery from '../queries/PartnershipQuery';
import ResultsScreen from './ResultsScreen';
import {
  screen,
  Screen,
} from '../ui/Screen';

class MakeGuessesScreen extends Component {
  state = {
    guesses: [""],
  };

  render() {
    return <Screen style={Styles.Screen}>
      <ExitButton navigator={this.props.navigator} />
      <FullScreenCard
        instructionText={
          this.guessedWord_() ? "GUESS THE CLUES" : "GUESS THE WORD"}
        word={this.props.game.word}
        clues={this.props.game.clues}
        guesses={this.state.guesses}
        activeIndex={this.state.guesses.length - 1} />
      <Keyboard
        onPressLetter={(letter) => this.onPressLetter_(letter)}
        onPressBackspace={() => this.onPressBackspace_()}
        submitButtonText="GUESS"
        onPressSubmit={() => this.onPressSubmit_()}
        onPressSkip={() => this.onPressSkip_()} />
    </Screen>;
  }

  guessedWord_() {
    return this.state.guesses.some((guess, i) => (
      i !== this.state.guesses.length - 1 &&
        isGuessCorrect(guess, this.props.game)
    ));
  }

  getCurrentGuess_() {
    const currentGuessIndex = this.state.guesses.length - 1;
    return this.state.guesses[currentGuessIndex];
  }

  getCurrentTarget_() {
    const currentGuessIndex = this.state.guesses.length - 1;
    const target = this.guessedWord_() ?
      this.props.game.clues[currentGuessIndex] : this.props.game.word;
    return target.split(" ").join("");
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

  onPressSkip_() {
    if (this.state.guesses.length === 4) {
      this.makeGuesses_();
    } else {
      this.setState({guesses: [...this.state.guesses, ""]});
    }
  }

  async makeGuesses_() {
    await this.props.makeGuesses(this.state.guesses);
    this.props.navigator.replace({
      component: ResultsScreen,
      props: {
        showCreateGame: true,
        ...this.props,
      },
      isModal: true,
    });
    logEvent(Event.MakeGuesses, {
      gameId: this.props.game.id,
      partnershipId: this.props.game.partnership.id,
      partnerId: this.props.game.partnership.partner.id,
      score: getScore(this.props.game),
    });
  }
}

const Styles = StyleSheet.create({
  Screen: {
    justifyContent: "flex-end",
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
      lastUpdated
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
    options: (props) => ({
      fetchPolicy: props.forceRefetch ? "network-only" : "cache-first",
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
          },
          refetchQueries: [{
            query: PartnershipQuery,
            variables: {
              partnershipId: ownProps.game.partnership.id,
              currentUserId: ownProps.currentUserId,
            },
          }],
        });
      }
    }),
  }),
  screen
)(MakeGuessesScreen);
