import React, {
  Component,
} from 'react';
import {
  ListView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Row,
  RowTitle,
  Screen,
  UserPicture,
} from '../ui/Elements';

export default class GameListScreen extends Component {
  render() {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (round1, round2) => round1.id !== round2.id
    });
    dataSource = dataSource.cloneWithRows(this.props.game.rounds);
    let listView = null;
    if (dataSource.getRowCount() > 0) {
      listView = <ListView
        dataSource={dataSource}
        renderRow={(round) => this.renderRoundRow_(round)} />;
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

  renderRoundRow_(round) {
    return <Row onPress={() => this.onPressRoundRow_(round)}>
      <RowTitle text={round.id} />
    </Row>;
  }

  onPressRoundRow_(round) {
    console.log(round);
  }

  onPressNewGame_() {
    this.props.navigator.push({component: NewGameScreen});
  }
}
