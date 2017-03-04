import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  BackButton,
  Button,
} from '../ui/Button';
import GameQuery from '../queries/GameQuery';
import {
  screen,
  Screen,
} from '../ui/Screen';

class MakeGuessesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guess1: "",
      guess2: "",
      guess3: "",
      guess4: ""
    };
  }

  render() {
    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Text>{this.props.game.word}</Text>
        <Text>Clues:</Text>
        <Text>{this.props.game.clues.join(", ")}</Text>
        <Text>Guesses:</Text>
        <TextInput
          name="guess1"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(guess1) => this.setState({guess1})} />
        <TextInput
          name="guess2"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(guess2) => this.setState({guess2})} />
        <TextInput
          name="guess3"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(guess3) => this.setState({guess3})} />
        <TextInput
          name="guess4"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(guess4) => this.setState({guess4})} />
        <Button onPress={() => this.makeGuesses_()} text="Submit" />
      </Screen>
    );
  }

  async makeGuesses_() {
    const guesses = [
      this.state.guess1,
      this.state.guess2,
      this.state.guess3,
      this.state.guess4
    ];
    await this.props.makeGuesses(guesses);
    this.props.navigator.pop();
  }
}

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
