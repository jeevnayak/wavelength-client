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
  CardView,
} from '../ui/Card';
import ChooseWordScreen from './ChooseWordScreen';
import Colors from '../ui/Colors';
import {
  GameState,
  getGameScreen,
  getGameState,
} from '../util/Helpers';
import PartnershipQuery from '../queries/PartnershipQuery';
import PlusIcon from '../icons/Plus';
import Row from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  BoldText,
} from '../ui/Text';
import UserPicture from '../ui/UserPicture';

const kCreateGamePlaceholderId = "creategame";
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
    let scoreSection;
    if (this.props.partnership.averageScore != null) {
      scoreSection = [
        <BoldText key="0" style={Styles.ScoreDesc}>AVERAGE SCORE:</BoldText>,
        <BoldText key="1" style={Styles.Score}>
          {this.props.partnership.averageScore}
        </BoldText>,
      ];
    }
    return (
      <Screen
          navigator={this.props.navigator}
          title={this.props.partnership.partner.name}>
        <ScrollView>
          <View style={Styles.UserPicturesContainer}>
            <UserPicture
              user={this.props.currentUser}
              style={Styles.UserPicture} />
            <UserPicture
              user={this.props.partnership.partner}
              style={Styles.UserPicture} />
          </View>
          {scoreSection}
          <Section
            headerText="Your turn"
            dataSource={this.dataSourceForGameStates_(
              [GameState.GiveClues, GameState.MakeGuesses], true)}
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

  dataSourceForGameStates_(gameStates, includeCreateGame) {
    const games = this.props.partnership.games.filter(
      (game) => gameStates.includes(getGameState(game)));
    games.sort((game1, game2) => (
      parseInt(game2.lastUpdated) - parseInt(game1.lastUpdated)
    ));
    if (includeCreateGame) {
      games.unshift({id: kCreateGamePlaceholderId});
    }
    return this.baseDataSource_.cloneWithRows(games);
  }

  renderGameRow_(game) {
    if (game.id === kCreateGamePlaceholderId) {
      const contents = <View style={Styles.NewGameIcon}>
        <PlusIcon size={kCardWidth / 3} />
      </View>;
      return <TouchableWithoutFeedback
          onPress={() => this.onPressCreateGame_()}>
        <View style={Styles.CardContainer}>
          <CardView width={kCardWidth} customContents={contents} />
        </View>
      </TouchableWithoutFeedback>;
    } else {
      return <TouchableWithoutFeedback
          onPress={() => this.onPressGameRow_(game)}>
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
  }

  onPressGameRow_(game) {
    let screen = getGameScreen(game);
    if (screen) {
      const partner = this.props.partnership.partner;
      this.props.navigator.push({
        component: screen,
        props: {
          currentUserId: this.props.currentUserId,
          currentUser: this.props.currentUser,
          gameId: game.id
        },
        isModal: true,
      });
    }
  }

  onPressCreateGame_() {
    this.props.navigator.push({
      component: ChooseWordScreen,
      props: {
        currentUserId: this.props.currentUserId,
        currentUser: this.props.currentUser,
        cluerId: this.props.currentUserId,
        guesserId: this.props.partnership.partner.id
      },
      isModal: true,
    });
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
        showsHorizontalScrollIndicator={false}
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
  NewGameIcon: {
    alignItems: "center",
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
