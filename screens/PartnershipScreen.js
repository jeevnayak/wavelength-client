import React, {
  Component,
} from 'react';
import {
  graphql,
} from 'react-apollo';
import {
  ListView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  LoadingScreen,
  Row,
  RowTitle,
  Screen,
  UserPicture,
} from '../ui/Elements';
import GiveCluesScreen from './GiveCluesScreen';
import {
  GameState,
  getGameState,
} from '../util/Helpers';
import MakeGuessesScreen from './MakeGuessesScreen';
import PartnershipQuery from '../queries/PartnershipQuery';
import ResultsScreen from './ResultsScreen';

class PartnershipScreen extends Component {
  constructor(props) {
    super(props);

    this.dataSource_ = new ListView.DataSource({
      getSectionHeaderData: (sectionData, sectionId) => sectionId,
      sectionHeaderHasChanged: (header1, header2) => header1 !== header2,
      rowHasChanged: (game1, game2) => game1.id !== game2.id
    });
  }

  render() {
    if (this.props.loading) {
      return <LoadingScreen />;
    }

    this.dataSource_ = this.dataSource_.cloneWithRowsAndSections(
      this.generateListViewData_(this.props.partnership.games));
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderSectionHeader={(header) => this.renderSectionHeader_(header)}
        renderRow={(game) => this.renderGameRow_(game)} />;
    }

    return (
      <Screen>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Back</Text>
        </TouchableHighlight>
        {listView}
      </Screen>
    );
  }

  generateListViewData_(games) {
    const data = {
      [GameState.GiveClues]: [],
      [GameState.MakeGuesses]: [],
      [GameState.TheirTurn]: [],
      [GameState.Complete]: []
    };
    for (const game of games) {
      data[getGameState(game)].push(game);
    }
    for (const section in data) {
      if (data[section].length === 0) {
        delete data[section];
      }
    }
    return data;
  }

  renderSectionHeader_(header) {
    return <Text>{header}</Text>;
  }

  renderGameRow_(game) {
    return <Row onPress={() => this.onPressGameRow_(game)}>
      <RowTitle text={game.id} />
    </Row>;
  }

  onPressGameRow_(game) {
    let screen;
    switch (getGameState(game)) {
      case GameState.GiveClues:
        screen = GiveCluesScreen;
        break;
      case GameState.MakeGuesses:
        screen = MakeGuessesScreen;
        break;
      case GameState.Complete:
        screen = ResultsScreen;
        break;
    }
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

export default graphql(PartnershipQuery, {
  props: ({ ownProps, data: { loading, partnership, refetch } }) => ({
    loading: loading,
    partnership: partnership,
  }),
})(PartnershipScreen);
