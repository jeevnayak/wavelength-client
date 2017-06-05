import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  ListView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Card,
} from '../ui/Card';
import Colors from '../ui/Colors';
import {
  GameState,
  getGameScreen,
  getGameState,
} from '../util/Helpers';
import PartnershipQuery from '../queries/PartnershipQuery';
import Row from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  BoldText,
} from '../ui/Text';
import UserPicture from '../ui/UserPicture';

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
      <Screen
          navigator={this.props.navigator}
          title={this.props.partnership.partner.name}>
        <ScrollView>
          <View style={Styles.UserPicturesContainer}>
            <UserPicture
              userId={this.props.currentUserId}
              style={Styles.UserPicture} />
            <UserPicture
              user={this.props.partnership.partner}
              style={Styles.UserPicture} />
          </View>
          <BoldText style={Styles.ScoreDesc}>SCORE:</BoldText>
          <BoldText style={Styles.Score}>15,000</BoldText>
          <Section
            headerText="Your turn"
            dataSource={this.dataSourceForGameStates_(
              [GameState.GiveClues, GameState.MakeGuesses])}
            renderGameRow={(game) => this.renderGameRow_(game)} />
          <Section
            headerText={`${this.props.partnership.partner.firstName}'s turn`}
            dataSource={this.dataSourceForGameStates_(
              [GameState.TheirTurnToGuess])}
            renderGameRow={(game) => this.renderGameRow_(game)} />
          <Section
            headerText="Completed"
            dataSource={this.dataSourceForGameStates_([GameState.Complete])}
            renderGameRow={(game) => this.renderGameRow_(game)} />
        </ScrollView>
      </Screen>
    );
  }

  dataSourceForGameStates_(gameStates) {
    const games = this.props.partnership.games.filter(
      (game) => gameStates.includes(getGameState(game)));
    games.sort((game1, game2) => (
      parseInt(game2.lastUpdated) - parseInt(game1.lastUpdated)
    ));
    return this.baseDataSource_.cloneWithRows(games);
  }

  renderGameRow_(game) {
    return <TouchableWithoutFeedback onPress={() => this.onPressGameRow_(game)}>
      <View style={Styles.CardContainer}>
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
    return <View style={Styles.Section}>
      <BoldText style={Styles.HeaderText}>
        {props.headerText.toUpperCase()}
      </BoldText>
      <ListView
        horizontal={true}
        dataSource={props.dataSource}
        renderRow={props.renderGameRow} />
    </View>;
  } else {
    return null;
  }
};

const Styles = StyleSheet.create({
  UserPicturesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingLeft: 80,
    paddingRight: 80,
  },
  ScoreDesc: {
    marginTop: 15,
    color: Colors.SecondaryText,
    textAlign: "center",
  },
  Score: {
    fontSize: 32,
    textAlign: "center",
  },
  UserPicture: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  Section: {
    marginTop: 25,
  },
  HeaderText: {
    paddingLeft: kCardMargin / 2,
    color: Colors.SecondaryText,
  },
  CardContainer: {
    width: kCardWidth + kCardMargin,
    padding: kCardMargin / 2,
  },
});

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
