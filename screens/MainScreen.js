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
  Button,
} from '../ui/Button';
import DailyChallengeScreen from './DailyChallengeScreen';
import DemoScreen from './DemoScreen';
import NewGameScreen from './NewGameScreen';
import PartnershipScreen from './PartnershipScreen';
import {
  Row,
} from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  getUserStore,
} from '../data/UserStore';
import UserQuery from '../queries/UserQuery';

class MainScreen extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (partnership1, partnership2) => (
        partnership1.id !== partnership2.id
      )
    });
    this.dataSource_ = dataSource;
  }

  render() {
    const logOut = getUserStore().clearCurrentUser.bind(getUserStore());
    this.dataSource_ = this.dataSource_.cloneWithRows(
      this.props.currentUser.partnerships);
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderRow={(partnership) => this.renderPartnershipRow_(partnership)} />;
    }

    return (
      <Screen>
        <Button onPress={() => this.onPressNewGame_()} text="New Game" />
        <Button
          onPress={() => this.onPressDailyChallenge_()}
          text="Daily Challenge" />
        <Button onPress={() => this.onPressDemo_()} text="Demo" />
        {listView}
        <Button onPress={logOut} text="Sign Out" />
      </Screen>
    );
  }

  renderPartnershipRow_(partnership) {
    return <Row
      title={partnership.partner.name}
      pictureUser={partnership.partner}
      onPress={() => this.onPressPartnershipRow_(partnership)} />;
  }

  onPressPartnershipRow_(partnership) {
    this.props.navigator.push({
      component: PartnershipScreen,
      props: {
        currentUserId: this.props.currentUser.id,
        partnershipId: partnership.id
      }
    });
  }

  onPressNewGame_() {
    this.props.navigator.push({
      component: NewGameScreen,
      props: {currentUser: this.props.currentUser}
    });
  }

  onPressDailyChallenge_() {
    this.props.navigator.push({
      component: DailyChallengeScreen,
      props: {
        currentUser: this.props.currentUser,
        currentUserId: this.props.currentUser.id
      }
    });
  }

  onPressDemo_() {
    this.props.navigator.push({component: DemoScreen});
  }
}

export default compose(
  graphql(UserQuery, {
    props: ({ ownProps, data: { loading, error, refetch, user } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      currentUser: user,
    }),
  }),
  screen
)(MainScreen);
