import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import {
  ExitButton,
} from '../ui/Button';
import {
  FullScreenCard,
  getFullScreenCardBottom,
} from '../ui/Card';
import ChooseWordScreen from './ChooseWordScreen';
import GameSummary from '../ui/GameSummary';
import GameQuery from '../queries/GameQuery';
import MainScreen from './MainScreen';
import PartnershipScreen from './PartnershipScreen';
import {
  screen,
  Screen,
} from '../ui/Screen';

class ResultsScreen extends Component {
  render() {
    const partner = this.props.game.partnership.partner;
    return <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Styles.CardContainer}>
          <FullScreenCard
            word={this.props.game.word}
            forceShowWord={true}
            clues={this.props.game.clues}
            guesses={this.props.game.guesses} />
        </View>
        <GameSummary
          style={Styles.GameSummary}
          game={this.props.game}
          cluer={this.props.game.isCluer ? this.props.currentUser : partner}
          guesser={this.props.game.isCluer ? partner : this.props.currentUser}
          onPressCreateGame={this.props.showCreateGame ?
            () => this.onPressCreateGame_() : null} />
      </ScrollView>
      <ExitButton navigator={this.props.navigator} />
    </Screen>;
  }

  onPressCreateGame_() {
    this.props.navigator.immediatelyResetRouteStack([
      {
        component: MainScreen,
        props: {
          currentUserId: this.props.currentUserId
        },
      },
      {
        component: PartnershipScreen,
        props: {
          currentUserId: this.props.currentUser.id,
          currentUser: this.props.currentUser,
          partnershipId: this.props.game.partnership.id,
        },
      },
      {
        component: ChooseWordScreen,
        props: {
          currentUserId: this.props.currentUserId,
          currentUser: this.props.currentUser,
          cluerId: this.props.currentUserId,
          guesserId: this.props.game.partnership.partner.id,
        },
        isModal: true,
      },
    ]);
  }
}

const Styles = StyleSheet.create({
  CardContainer: {
    height: Dimensions.get("window").height,
  },
  GameSummary: {
    marginTop: getFullScreenCardBottom() + 25,
  },
});

export default compose(
  graphql(GameQuery, {
    props: ({ ownProps, data: { loading, error, refetch, game } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      game: game,
    }),
  }),
  screen
)(ResultsScreen);
