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

class GiveCluesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clue1: "",
      clue2: "",
      clue3: "",
      clue4: ""
    };
  }

  render() {
    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Text>{this.props.game.word}</Text>
        <Text>Clues:</Text>
        <TextInput
          name="clue1"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(clue1) => this.setState({clue1})} />
        <TextInput
          name="clue2"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(clue2) => this.setState({clue2})} />
        <TextInput
          name="clue3"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(clue3) => this.setState({clue3})} />
        <TextInput
          name="clue4"
          style={{height: 40, borderColor: "gray", borderWidth: 1}}
          autoCapitalize="characters"
          onChangeText={(clue4) => this.setState({clue4})} />
        <Button onPress={() => this.giveClues_()} text="Submit" />
      </Screen>
    );
  }

  async giveClues_() {
    const clues = [
      this.state.clue1,
      this.state.clue2,
      this.state.clue3,
      this.state.clue4
    ];
    await this.props.giveClues(clues);
    this.props.navigator.pop();
  }
}

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
