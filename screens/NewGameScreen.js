import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
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
  withFbFriends,
} from '../data/FbFriendStore';
import GiveCluesScreen from './GiveCluesScreen';
import {
  Row,
} from '../ui/Row';
import {
  LoadingScreen,
  screen,
  Screen,
} from '../ui/Screen';

class NewGameScreen extends Component {
  constructor(props) {
    super(props);

    this.dataSource_ = new ListView.DataSource({
      rowHasChanged: (friend1, friend2) => friend1.id !== friend2.id
    });
  }

  render() {
    if (this.props.loadingFbFriends) {
      return <LoadingScreen />;
    }

    this.dataSource_ = this.dataSource_.cloneWithRows(this.props.fbFriends);
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderRow={(friend) => this.renderFbFriendRow_(friend)} />;
    }

    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        {listView}
      </Screen>
    );
  }

  renderFbFriendRow_(friend) {
    return <Row
      title={friend.name}
      pictureUser={friend}
      onPress={() => this.onPressFriendRow_(friend)} />;
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

export default compose(
  graphql(newGameMutation, {
    props: ({ mutate }) => ({
      createNewGame: (cluerId, guesserId) => {
        return mutate({
          variables: { cluerId, guesserId }
        });
      }
    }),
  }),
  withFbFriends,
  screen
)(NewGameScreen);
