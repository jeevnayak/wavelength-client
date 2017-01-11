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
import {
  getFbFriendStore,
} from '../model/store/FbFriendStore';
import {
  getGameStore,
} from '../model/store/GameStore';
import {
  getUserStore,
} from '../model/store/UserStore'

export default class NewGameScreen extends Component {
  componentDidMount() {
    this.isMounted_ = true;
    getGameStore().addListener(this.onModelUpdate_);
    const fbFriendStore = getFbFriendStore();
    fbFriendStore.addListener(this.onModelUpdate_);
    fbFriendStore.refresh();
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    getGameStore().removeListener(this.onModelUpdate_);
    getFbFriendStore().removeListener(this.onModelUpdate_);
  }

  render() {
    const fbFriendStore = getFbFriendStore();
    if (!fbFriendStore.isInitialized()) {
      // TODO: loading state
      return null;
    }

    let dataSource = new ListView.DataSource({
      rowHasChanged: (friend1, friend2) => friend1.id !== friend2.id
    });
    dataSource = dataSource.cloneWithRows(fbFriendStore.getNonPartnerFriends());
    let listView = null;
    if (dataSource.getRowCount() > 0) {
      listView = <ListView
        dataSource={dataSource}
        renderRow={(friend) => this.renderFbFriendRow_(friend)} />;
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

  renderFbFriendRow_(friend) {
    return <Row onPress={() => this.onPressFriendRow_(friend)}>
      <UserPicture user={friend} />
      <RowTitle text={friend.name} />
    </Row>;
  }

  async onPressFriendRow_(friend) {
    const game = await getGameStore().createGame(friend);
    console.log(game);
  }

  onModelUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
    }
  };
}
