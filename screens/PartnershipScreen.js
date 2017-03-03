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
  BackButton,
} from '../ui/Button';
import {
  GameState,
  getGameScreen,
  getGameState,
} from '../util/Helpers';
import PartnershipQuery from '../queries/PartnershipQuery';
import {
  HeaderRow,
  Row,
} from '../ui/Row';
import {
  LoadingScreen,
  Screen,
} from '../ui/Screen';

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
      this.generateListViewData_());
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderSectionHeader={(header) => this.renderSectionHeader_(header)}
        renderRow={(game) => this.renderGameRow_(game)} />;
    }

    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        {listView}
      </Screen>
    );
  }

  generateListViewData_() {
    const data = {
      [GameState.GiveClues]: [],
      [GameState.MakeGuesses]: [],
      [GameState.TheirTurn]: [],
      [GameState.Complete]: []
    };
    for (const game of this.props.partnership.games) {
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
    return <HeaderRow text={header} />;
  }

  renderGameRow_(game) {
    return <Row
      title={game.id}
      onPress={() => this.onPressGameRow_(game)}/>;
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

export default graphql(PartnershipQuery, {
  props: ({ ownProps, data: { loading, partnership, refetch } }) => ({
    loading: loading,
    partnership: partnership,
  }),
})(PartnershipScreen);
