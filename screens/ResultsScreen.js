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
  BackButton,
} from '../ui/Button';
import GameQuery from '../queries/GameQuery';
import {
  LoadingScreen,
  Screen,
} from '../ui/Screen';

class ResultsScreen extends Component {
  render() {
    if (this.props.loading) {
      return <LoadingScreen />;
    }

    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Text>{this.props.game.word}</Text>
        <Text>Clues:</Text>
        <Text>{this.props.game.clues.join(", ")}</Text>
        <Text>Guesses:</Text>
        <Text>{this.props.game.guesses.join(", ")}</Text>
      </Screen>
    );
  }
}

export default graphql(GameQuery, {
  props: ({ ownProps, data: { loading, game, refetch } }) => ({
    loading: loading,
    game: game,
  }),
})(ResultsScreen);
