import gql from 'graphql-tag';
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

class NewGameScreen extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (friend1, friend2) => friend1.id !== friend2.id
    });
    this.state = {
      loading: true,
      dataSource: dataSource
    }
    this.fetchFbFriends_();
  }

  render() {
    if (this.state.loading) {
      return <LoadingScreen />;
    }

    let listView;
    if (this.state.dataSource.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.state.dataSource}
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
    const resp = await this.props.createNewGame(
      this.props.currentUser.id, friend.id);
    this.props.navigator.replace({
      component: GiveCluesScreen,
      props: {
        currentUserId: this.props.currentUser.id,
        gameId: resp.data.newGame.id
      }
    });
  }

  async fetchFbFriends_() {
    let fbFriends = [];
    try {
      const fbId = this.props.currentUser.id.substring(2);
      const resp = await fetch(
        `https://graph.facebook.com/${fbId}/friends?` +
        `access_token=${this.props.currentUser.fbToken}&` +
        `fields=${Constants.FbUserFields}`);
      const respJson = await resp.json();
      for (const fbUserInfo of respJson.data) {
        fbFriends.push({
          id: Constants.FbUserIdPrefix + fbUserInfo.id,
          name: fbUserInfo.name,
          firstName: fbUserInfo.first_name,
          lastName: fbUserInfo.last_name
        });
      }
    } catch (error) {
    }
    this.setState({
      loading: false,
      dataSource: this.state.dataSource.cloneWithRows(fbFriends)
    });
  }
}

const newGameMutation = gql`
  mutation newGame($cluerId: String!, $guesserId: String!) {
    newGame(cluerId: $cluerId, guesserId: $guesserId) {
      id
      word
      isCluer(userId: $cluerId)
      clues
      guesses
      replayed
    }
  }
`;

export default graphql(newGameMutation, {
  props: ({ mutate }) => ({
    createNewGame: (cluerId, guesserId) => {
      return mutate({
        variables: { cluerId, guesserId }
      });
    }
  }),
})(NewGameScreen);
