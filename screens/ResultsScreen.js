import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import {
  ExitButton,
} from '../ui/Button';
import {
  FullScreenCard,
  getFullScreenCardBottom,
} from '../ui/Card';
import GameSummary from '../ui/GameSummary';
import GameQuery from '../queries/GameQuery';
import {
  screen,
  Screen,
} from '../ui/Screen';

class ResultsScreen extends Component {
  render() {
    return (
      <Screen>
        <ScrollView>
          <View style={Styles.CardContainer}>
            <FullScreenCard
              word={this.props.game.word}
              forceShowWord={true}
              clues={this.props.game.clues}
              guesses={this.props.game.guesses} />
          </View>
          <GameSummary
            style={Styles.GameSummary}
            game={this.props.game}
            cluer={this.props.cluer}
            guesser={this.props.guesser} />
        </ScrollView>
        <ExitButton navigator={this.props.navigator} />
      </Screen>
    );
  }
}

const Styles = StyleSheet.create({
  CardContainer: {
    height: Dimensions.get("window").height,
  },
  GameSummary: {
    marginTop: getFullScreenCardBottom() + 25,
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
