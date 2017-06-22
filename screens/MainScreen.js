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
import ChooseWordScreen from './ChooseWordScreen';
import {
  setUserProperties,
} from '../util/Logging';
import NewGameScreen from './NewGameScreen';
import PartnershipScreen from './PartnershipScreen';
import Row from '../ui/Row';
import {
  screen,
  Screen,
} from '../ui/Screen';
import {
  CenteredBoldText,
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
        partnership1.id !== partnership2.id ||
        partnership1.numPendingGames !== partnership2.numPendingGames ||
        partnership1.averageScore !== partnership2.averageScore
      )
    });
  }

  componentDidMount() {
    setUserProperties(this.props.currentUser);
  }

  render() {
    const logOut = getUserStore().clearCurrentUser.bind(getUserStore());
    const partnerships = this.props.currentUser.partnerships.slice(0).sort(
      (p1, p2) => p2.numPendingGames - p1.numPendingGames);
    this.dataSource_ = this.dataSource_.cloneWithRows(
      [{id: kNewGamePlaceholderId}, ...partnerships]);
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        removeClippedSubviews={false}
        dataSource={this.dataSource_}
        renderRow={(partnership) => this.renderPartnershipRow_(partnership)} />;
    }

    return (
      <Screen>
        <CenteredBoldText style={Styles.Title} textStyle={Styles.TitleText}>
          WAVELENGTH
        </CenteredBoldText>
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
      let subtitle;
      if (partnership.averageScore != null) {
        subtitle = `SCORE: ${partnership.averageScore}`;
      }
      return <Row
        title={partnership.partner.name.toUpperCase()}
        subtitle={subtitle}
        pictureUser={partnership.partner}
        badgeCount={partnership.numPendingGames}
        onPress={() => this.onPressPartnershipRow_(partnership)}
        onPressCreateGame={() => this.onPressCreateGame_(partnership)} />;
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

  onPressCreateGame_(partnership) {
    this.props.navigator.push({
      component: ChooseWordScreen,
      props: {
        currentUserId: this.props.currentUser.id,
        cluerId: this.props.currentUser.id,
        guesserId: partnership.partner.id
      },
      isModal: true,
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
    height: 120,
  },
  TitleText: {
    fontSize: 28,
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
