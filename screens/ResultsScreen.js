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
  screen,
  Screen,
} from '../ui/Screen';

class ResultsScreen extends Component {
  render() {
    return (
      <Screen style={Styles.Screen}>
        <BackButton navigator={this.props.navigator} />
        <FullScreenCard
          word={this.props.game.word}
          forceShowWord={true}
          clues={this.props.game.clues}
          guesses={this.props.game.guesses} />
      </Screen>
    );
  }
}

const Styles = StyleSheet.create({
  Screen: {
    justifyContent: "flex-start",
  },
});

export default compose(
  graphql(GameQuery, {
    props: ({ ownProps, data: { loading, error, refetch, game } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      game: game,
    }),
  }),
  screen
)(ResultsScreen);
