import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  ListView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Button,
} from '../ui/Button';
import NewGameScreen from './NewGameScreen';
import PartnershipScreen from './PartnershipScreen';
import Row from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  BoldText,
} from '../ui/Text';
import {
  getUserStore,
} from '../data/UserStore';
import UserQuery from '../queries/UserQuery';

const kNewGamePlaceholderId = "newgame";

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.dataSource_ = new ListView.DataSource({
      rowHasChanged: (partnership1, partnership2) => (
        partnership1.id !== partnership2.id
      )
    });
  }

  render() {
    const logOut = getUserStore().clearCurrentUser.bind(getUserStore());
    this.dataSource_ = this.dataSource_.cloneWithRows(
      [{id: kNewGamePlaceholderId}, ...this.props.currentUser.partnerships]);
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderRow={(partnership) => this.renderPartnershipRow_(partnership)} />;
    }

    return (
      <Screen>
        <BoldText style={Styles.Title}>WAVELENGTH</BoldText>
        {listView}
        <Button onPress={logOut} text="Sign Out" />
      </Screen>
    );
  }

  renderPartnershipRow_(partnership) {
    if (partnership.id === kNewGamePlaceholderId) {
      return <Row
        title="NEW GAME"
        onPress={() => this.onPressNewGame_()} />;
    } else {
      return <Row
        title={partnership.partner.name.toUpperCase()}
        subtitle="SCORE: 1,500"
        pictureUser={partnership.partner}
        onPress={() => this.onPressPartnershipRow_(partnership)} />;
    }
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

const Styles = StyleSheet.create({
  Title: {
    fontSize: 28,
    textAlign: "center",
    height: 120,
    lineHeight: 120,
  },
});

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
