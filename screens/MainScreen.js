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
import NewGameScreen from './NewGameScreen';
import PartnershipScreen from './PartnershipScreen';
import {
  getUserStore,
} from '../data/UserStore';

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
    if (this.props.loading) {
      return <LoadingScreen />;
    }

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
        <Text>{this.props.currentUser.name} is logged in!</Text>
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

  renderPartnershipRow_(partnership) {
    return <Row onPress={() => this.onPressPartnershipRow_(partnership)}>
      <UserPicture user={partnership.partner} />
      <RowTitle text={partnership.partner.name} />
    </Row>;
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
}

const query = gql`
  query query($currentUserId: String!) {
    user(id: $currentUserId) {
      id
      name
      firstName
      lastName
      fbToken
      partnerships {
        id
        partner(userId: $currentUserId) {
          id
          name
        }
      }
    }
  }
`;

export default graphql(query, {
  props: ({ ownProps, data: { loading, user, refetch } }) => ({
    loading: loading,
    currentUser: user,
  }),
})(MainScreen);
