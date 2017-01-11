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
import GameScreen from './GameScreen';
import NewGameScreen from './NewGameScreen';
import {
  getGameStore,
} from '../model/store/GameStore';
import {
  getUserStore,
} from '../model/store/UserStore';

export default class GameListScreen extends Component {
  componentDidMount() {
    this.isMounted_ = true;
    const gameStore = getGameStore();
    gameStore.addListener(this.onModelUpdate_);
    // TODO: fix this
    gameStore.refresh();
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    getGameStore().removeListener(this.onModelUpdate_);
  }

  render() {
    const logOut = getUserStore().clearCurrentUser.bind(getUserStore());
    let dataSource = new ListView.DataSource({
      rowHasChanged: (game1, game2) => game1.id !== game2.id
    });
    dataSource = dataSource.cloneWithRows(getGameStore().getGames());
    let listView = null;
    if (dataSource.getRowCount() > 0) {
      listView = <ListView
        dataSource={dataSource}
        renderRow={(game) => this.renderGameRow_(game)} />;
    }

    return (
      <Screen>
        <Text>{this.props.user.name} is logged in!</Text>
        <TouchableHighlight onPress={() => this.onPressNewGame_()}>
          <Text>New game</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={logOut}>
          <Text>Log out</Text>
        </TouchableHighlight>
        {listView}
      </Screen>
    );
  }

  renderGameRow_(game) {
    return <Row onPress={() => this.onPressGameRow_(game)}>
      <UserPicture user={game.getPartner()} />
      <RowTitle text={game.getPartner().name} />
    </Row>;
  }

  onPressGameRow_(game) {
    this.props.navigator.push({
      component: GameScreen,
      props: {game: game}
    });
  }

  onPressNewGame_() {
    this.props.navigator.push({component: NewGameScreen});
  }

  onModelUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
    }
  };
}
