import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  ListView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  BackButton,
} from '../ui/Button';
import {
  Card,
} from '../ui/Card';
import {
  GameState,
  getGameScreen,
  getGameState,
} from '../util/Helpers';
import PartnershipQuery from '../queries/PartnershipQuery';
import {
  Row,
} from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';

const kCardWidth = 60;
const kCardMargin = 10;

class PartnershipScreen extends Component {
  constructor(props) {
    super(props);

    this.baseDataSource_ = new ListView.DataSource({
      rowHasChanged: (game1, game2) => game1.id !== game2.id
    });
  }

  render() {
    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Section
          headerText="Your turn"
          dataSource={this.dataSourceForGameStates_(
            [GameState.GiveClues, GameState.MakeGuesses])}
          renderGameRow={(game) => this.renderGameRow_(game)} />
        <Section
          headerText="Their turn"
          dataSource={this.dataSourceForGameStates_(
            [GameState.TheirTurnToGuess])}
          renderGameRow={(game) => this.renderGameRow_(game)} />
        <Section
          headerText="Complete"
          dataSource={this.dataSourceForGameStates_([GameState.Complete])}
          renderGameRow={(game) => this.renderGameRow_(game)} />
      </Screen>
    );
  }

  dataSourceForGameStates_(gameStates) {
    const games = this.props.partnership.games.filter(
      (game) => gameStates.includes(getGameState(game)));
    return this.baseDataSource_.cloneWithRows(games);
  }

  renderGameRow_(game) {
    var containerStyle = {
      width: kCardWidth + kCardMargin,
      padding: kCardMargin / 2,
    }
    return <TouchableWithoutFeedback onPress={() => this.onPressGameRow_(game)}>
      <View style={containerStyle}>
        <Card
          word={game.word}
          forceShowWord={
            game.isCluer || getGameState(game) === GameState.Complete}
          clues={game.clues}
          guesses={game.guesses}
          width={kCardWidth}
          thumbnail={true} />
      </View>
    </TouchableWithoutFeedback>;
  }

  onPressGameRow_(game) {
    let screen = getGameScreen(game);
    if (screen) {
      this.props.navigator.push({
        component: screen,
        props: {
          currentUserId: this.props.currentUserId,
          gameId: game.id
        }
      });
    }
  }
}

const Section = (props) => {
  if (props.dataSource.getRowCount() > 0) {
    return <View>
      <Text>{props.headerText}</Text>
      <ListView
        horizontal={true}
        dataSource={props.dataSource}
        renderRow={props.renderGameRow} />
    </View>;
  } else {
    return null;
  }
};

export default compose(
  graphql(PartnershipQuery, {
    props: ({ ownProps, data: { loading, error, refetch, partnership } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      partnership: partnership,
    }),
  }),
  screen
)(PartnershipScreen);
