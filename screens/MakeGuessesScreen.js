import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  graphql,
} from 'react-apollo';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Screen,
} from '../ui/Elements';

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
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Back</Text>
        </TouchableHighlight>
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
        <TouchableHighlight onPress={() => this.makeGuesses_()}>
          <Text>Submit</Text>
        </TouchableHighlight>
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
    await this.props.makeGuesses(this.props.game.id, guesses);
    this.props.navigator.pop();
  }
}

const makeGuessesMutation = gql`
  mutation makeGuesses($gameId: Int!, $guesses: [String]!) {
    makeGuesses(gameId: $gameId, guesses: $guesses) {
      id
    }
  }
`;

export default graphql(makeGuessesMutation, {
  props: ({ mutate }) => ({
    makeGuesses: (gameId, guesses) => {
      mutate({
        variables: { gameId, guesses }
      });
    }
  }),
})(MakeGuessesScreen);
