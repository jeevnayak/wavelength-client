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
  TouchableOpacity,
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
  kMaxScore,
  needsReplay,
} from '../util/Helpers';
import PartnershipQuery from '../queries/PartnershipQuery';
import PlusIcon from '../icons/Plus';
import Row from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import Sizes from '../ui/Sizes';
import {
  getStats,
} from '../util/Stats';
import {
  BoldText,
} from '../ui/Text';
import UserPicture from '../ui/UserPicture';

const kCreateGamePlaceholderId = "creategame";
const kSpacingRowPlaceholderId = "spacingrow";
const kPadding = 28;
const kCardWidth = 70;
const kCardMargin = 12;
const kCardProps = {
  width: kCardWidth,
  height: 96,
  headerHeight: 20,
  headerTextSize: 10,
  clueHeight: 14,
  borderSize: 3,
  borderRadius: 4,
  innerBorderRadius: 1,
};

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
        <BoldText key="0" style={Styles.ScoreDesc}>SCORE:</BoldText>,
        <BoldText key="1" style={Styles.Score}>
          {this.props.partnership.averageScore} / {kMaxScore}
        </BoldText>,
      ];
    }
    return (
      <Screen
          navigator={this.props.navigator}
          title={this.props.partnership.partner.name}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={Styles.UserPicturesContainer}>
            <UserPicture
              user={this.props.partnership.user}
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
          <StatsSection partnership={this.props.partnership} />
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
    games.unshift({id: kSpacingRowPlaceholderId});
    return this.baseDataSource_.cloneWithRows(games);
  }

  renderGameRow_(game) {
    if (game.id === kSpacingRowPlaceholderId) {
      return <View style={Styles.SpacingRow} />
    } else if (game.id === kCreateGamePlaceholderId) {
      const contents = <View style={Styles.NewGameIcon}>
        <PlusIcon size={kCardWidth / 3} />
      </View>;
      return <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.onPressCreateGame_()}>
        <View style={Styles.CardContainer}>
          <CardView {...kCardProps} customContents={contents} />
        </View>
      </TouchableOpacity>;
    } else {
      return <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.onPressGameRow_(game)}>
        <View style={Styles.CardContainer}>
          <Card
            {...kCardProps}
            word={game.word}
            forceShowWord={
              game.isCluer || getGameState(game) === GameState.Complete}
            clues={game.clues}
            guesses={game.guesses}
            thumbnail={true} />
          <View style={[
            Styles.UnreadDot,
            needsReplay(game) && Styles.ActiveUnreadDot]} />
        </View>
      </TouchableOpacity>;
    }
  }

  onPressGameRow_(game) {
    let { screen, props } = getGameScreen(game);
    if (screen) {
      const partner = this.props.partnership.partner;
      this.props.navigator.push({
        component: screen,
        props: {
          currentUserId: this.props.currentUserId,
          gameId: game.id,
          ...props,
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
        cluerId: this.props.currentUserId,
        guesserId: this.props.partnership.partner.id
      },
      isModal: true,
    });
  }
}

const Section = (props) => {
  if (props.dataSource.getRowCount() > 1) {
    return <View style={Styles.Section}>
      <BoldText style={Styles.HeaderText}>
        {props.headerText.toUpperCase()}
      </BoldText>
      <ListView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        dataSource={props.dataSource}
        renderRow={props.renderGameRow} />
    </View>;
  } else {
    return null;
  }
};

const StatsSection = (props) => (
  <View style={[Styles.Section, Styles.StatsSection]}>
    <BoldText style={[Styles.HeaderText, Styles.StatsHeader]}>STATS</BoldText>
    {getStats(props.partnership).map((stat, i) => <Stat key={i} stat={stat} />)}
  </View>
);

const Stat = (props) => (
  <View style={Styles.Stat}>
    <BoldText style={Styles.StatText}>
      {props.stat.title.toUpperCase()}
    </BoldText>
    <BoldText style={Styles.StatText}>{props.stat.value}</BoldText>
  </View>
);

const Styles = StyleSheet.create({
  UserPicturesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 8,
  },
  ScoreDesc: {
    marginTop: 15,
    color: Colors.SecondaryText,
    fontSize: Sizes.SmallText,
    textAlign: "center",
  },
  Score: {
    fontSize: Sizes.LargeText,
    textAlign: "center",
    marginBottom: 8,
  },
  UserPicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    marginLeft: 16,
    marginRight: 16,
  },
  Section: {
    marginTop: 16,
  },
  HeaderText: {
    paddingLeft: kPadding,
    paddingBottom: 2,
    color: Colors.SecondaryText,
    fontSize: Sizes.SmallText,
  },
  CardContainer: {
    width: kCardWidth + kCardMargin,
    padding: kCardMargin / 2,
    alignItems: "center",
  },
  SpacingRow: {
    width: kPadding - kCardMargin / 2 + 1,
  },
  NewGameIcon: {
    alignItems: "center",
  },
  UnreadDot: {
    width: 8,
    height: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  ActiveUnreadDot: {
    backgroundColor: Colors.Primary,
  },
  StatsSection: {
    paddingBottom: 96,
  },
  StatsHeader: {
    marginBottom: 12,
  },
  Stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingLeft: kPadding,
    paddingRight: kPadding,
  },
  StatText: {
    fontSize: Sizes.Text,
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
