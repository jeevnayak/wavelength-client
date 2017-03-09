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
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  BackButton,
  Button,
} from '../ui/Button';
import GameQuery from '../queries/GameQuery';
import Keyboard from '../ui/Keyboard';
import Letter from '../ui/Letter';
import {
  screen,
  Screen,
} from '../ui/Screen';

class GiveCluesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clues: [""],
    };
  }

  render() {
    const clues = this.state.clues.map((clue, i) => {
      const letters = clue.split("").map(
        (letter, i) => <Letter key={i} value={letter} />);
      return <View key={i} style={Styles.Clue}>{letters}</View>;
    });
    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Text>{this.props.game.word}</Text>
        <Text>Clues:</Text>
        {clues}
        <Keyboard
          onPressLetter={(letter) => this.onPressLetter_(letter)}
          onPressBackspace={() => this.onPressBackspace_()}
          onPressSubmit={() => this.onPressSubmit_()} />
      </Screen>
    );
  }

  onPressLetter_(letter) {
    this.state.clues[this.state.clues.length - 1] += letter;
    this.setState({clues: this.state.clues});
  }

  onPressBackspace_() {
    let currentClue = this.state.clues[this.state.clues.length - 1];
    currentClue = currentClue.substring(0, currentClue.length - 1);
    this.state.clues[this.state.clues.length - 1] = currentClue;
    this.setState({clues: this.state.clues});
  }

  onPressSubmit_() {
    if (this.state.clues.length === 4) {
      this.giveClues_();
    } else {
      this.setState({clues: [...this.state.clues, ""]});
    }
  }

  async giveClues_() {
    await this.props.giveClues(this.state.clues);
    this.props.navigator.pop();
  }
}

const Styles = StyleSheet.create({
  Clue: {
    flexDirection: "row",
  },
});

const giveCluesMutation = gql`
  mutation giveClues($currentUserId: String!, $gameId: Int!, $clues: [String]!) {
    giveClues(gameId: $gameId, clues: $clues) {
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
  graphql(giveCluesMutation, {
    props: ({ ownProps, mutate }) => ({
      giveClues: (clues) => {
        mutate({
          variables: {
            currentUserId: ownProps.currentUserId,
            gameId: ownProps.gameId,
            clues: clues
          }
        });
      }
    }),
  }),
  screen
)(GiveCluesScreen);
