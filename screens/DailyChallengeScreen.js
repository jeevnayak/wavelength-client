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

import DailyChallengeQuery from '../queries/DailyChallengeQuery';
import {
  BackButton,
  Button,
  LoadingScreen,
  Row,
  Screen,
} from '../ui/Elements';
import {
  withFbFriends,
} from '../data/FbFriendStore';
import {
  getGameScreen,
  getGameState,
} from '../util/Helpers';

class DailyChallengeScreen extends Component {
  constructor(props) {
    super(props);

    this.dataSource_ = new ListView.DataSource({
      rowHasChanged: (friend1, friend2) => friend1.id !== friend2.id
    });
  }

  render() {
    if (this.props.loading ||
        (this.props.loadingFbFriends && this.props.games.length === 0)) {
      return <LoadingScreen />;
    }

    let contents;
    if (this.props.games.length > 0) {
      contents = this.props.games.map(
        (game, i) => <Row
          key={i}
          title={`Game ${i + 1}: ${getGameState(game)}`}
          onPress={() => this.onPressGameRow_(game)} />);
    } else {
      this.dataSource_ = this.dataSource_.cloneWithRows(
        this.generateListViewData_());
      if (this.dataSource_.getRowCount() > 0) {
        contents = <ListView
          dataSource={this.dataSource_}
          renderRow={(friend) => this.renderFriendRow_(friend)} />;
      }
    }

    return <Screen>
      <BackButton navigator={this.props.navigator} />
      {contents}
    </Screen>;
  }

  generateListViewData_() {
    return this.props.fbFriends.map((friend) => ({
      ...friend,
      receivedRequestId: this.getRequestIdForFriend_(
        friend, this.props.incomingRequests),
      sentRequestId: this.getRequestIdForFriend_(
        friend, this.props.outgoingRequests),
    }));
  }

  getRequestIdForFriend_(friend, requests) {
    const request = requests.find(
      (request) => request.partner.id === friend.id);
    return request ? request.id : null;
  }

  renderFriendRow_(friend) {
    var button;
    if (friend.receivedRequestId) {
      button = <Button
        text="Accept request"
        onPress={() => this.acceptRequest_(friend.receivedRequestId)} />;
    } else if (friend.sentRequestId) {
      button = <Text>Request sent</Text>;
    } else {
      button = <Button
        text="Send request"
        onPress={() => this.sendRequest_(friend.id)} />;
    }
    return <Row title={friend.name} pictureUser={friend} button={button} />;
  }

  async sendRequest_(friendId) {
    await this.props.sendRequest(this.props.currentUserId, friendId);
  }

  async acceptRequest_(requestId) {
    await this.props.acceptRequest(requestId);
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

const sendDailyChallengeRequestMutation = gql`
  mutation sendDailyChallengeRequest($fromUserId: String!, $toUserId: String!) {
    sendDailyChallengeRequest(fromUserId: $fromUserId, toUserId: $toUserId) {
      id
    }
  }
`;

const acceptDailyChallengeRequestMutation = gql`
  mutation acceptDailyChallengeRequest($requestId: Int!) {
    acceptDailyChallengeRequest(requestId: $requestId) {
      id
    }
  }
`;

export default withFbFriends(graphql(DailyChallengeQuery, {
  props: ({ ownProps, data: { loading, user, refetch } }) => ({
    loading: loading,
    user: user,
    incomingRequests: user ? user.dailyChallengeInfo.incomingRequests : [],
    outgoingRequests: user ? user.dailyChallengeInfo.outgoingRequests : [],
    games: user ? user.dailyChallengeInfo.games : [],
  }),
})(graphql(sendDailyChallengeRequestMutation, {
  props: ({ mutate }) => ({
    sendRequest: (fromUserId, toUserId) => {
      return mutate({
        variables: { fromUserId, toUserId }
      });
    }
  }),
})(graphql(acceptDailyChallengeRequestMutation, {
  props: ({ mutate }) => ({
    acceptRequest: (requestId) => {
      return mutate({
        variables: { requestId }
      });
    }
  }),
})(DailyChallengeScreen))));