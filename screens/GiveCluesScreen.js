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
  LoadingScreen,
  Screen,
} from '../ui/Elements';
import GameQuery from '../queries/GameQuery';

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
    if (this.props.loading) {
      return <LoadingScreen />;
    }

    return (
      <Screen>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Back</Text>
        </TouchableHighlight>
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
        <TouchableHighlight onPress={() => this.giveClues_()}>
          <Text>Submit</Text>
        </TouchableHighlight>
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
    await this.props.giveClues(this.props.game.id, clues);
    this.props.navigator.pop();
  }
}

const giveCluesMutation = gql`
  mutation giveClues($gameId: Int!, $clues: [String]!) {
    giveClues(gameId: $gameId, clues: $clues) {
      id
    }
  }
`;

export default graphql(GameQuery, {
  props: ({ ownProps, data: { loading, game, refetch } }) => ({
    loading: loading,
    game: game,
  }),
})(graphql(giveCluesMutation, {
  props: ({ mutate }) => ({
    giveClues: (gameId, clues) => {
      mutate({
        variables: { gameId, clues }
      });
    }
  }),
})(GiveCluesScreen));
