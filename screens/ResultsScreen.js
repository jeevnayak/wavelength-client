import gql from 'graphql-tag';
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
import {
  getScore,
  needsReplay,
} from '../util/Helpers';
import {
  Event,
  logEvent,
} from '../util/Logging';
import MainScreen from './MainScreen';
import PartnershipQuery from '../queries/PartnershipQuery';
import PartnershipScreen from './PartnershipScreen';
import {
  screen,
  Screen,
} from '../ui/Screen';

class ResultsScreen extends Component {
  componentDidMount() {
    if (needsReplay(this.props.game)) {
      this.props.markReplayed();
      logEvent(Event.ViewReplay, {
        gameId: this.props.game.id,
        partnershipId: this.props.game.partnership.id,
        partnerId: this.props.game.partnership.partner.id,
        score: getScore(this.props.game),
      });
    }
  }

  render() {
    let summary;
    if (!this.props.hideSummary) {
      const user = this.props.game.partnership.user;
      const partner = this.props.game.partnership.partner;
      summary = <GameSummary
        style={Styles.GameSummary}
        game={this.props.game}
        cluer={this.props.game.isCluer ? user : partner}
        guesser={this.props.game.isCluer ? partner : user}
        onPressCreateGame={this.props.showCreateGame ?
          () => this.onPressCreateGame_() : null} />;
    }
    return <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Styles.CardContainer}>
          <FullScreenCard
            word={this.props.game.word}
            forceShowWord={true}
            clues={this.props.game.clues}
            guesses={this.props.game.guesses} />
        </View>
        {summary}
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
          currentUserId: this.props.currentUserId,
          partnershipId: this.props.game.partnership.id,
        },
      },
      {
        component: ChooseWordScreen,
        props: {
          currentUserId: this.props.currentUserId,
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

const markReplayedMutation = gql`
  mutation markReplayed($currentUserId: String!, $gameId: Int!) {
    markReplayed(gameId: $gameId) {
      id
      word
      isCluer(userId: $currentUserId)
      clues
      guesses
      replayed
      lastUpdated
    }
  }
`;

export default compose(
  graphql(GameQuery, {
    props: ({ ownProps, data: { loading, error, refetch, game } }) => ({
      loading: loading,
      error: error,
      refetch: refetch,
      game: game,
    }),
  }),
  graphql(markReplayedMutation, {
    props: ({ ownProps, mutate }) => ({
      markReplayed: () => {
        mutate({
          variables: {
            currentUserId: ownProps.currentUserId,
            gameId: ownProps.gameId,
          },
          update: (proxy) => {
            const queryVariables = {
              partnershipId: ownProps.game.partnership.id,
              currentUserId: ownProps.currentUserId,
            };
            try {
              const data = proxy.readQuery({
                query: PartnershipQuery,
                variables: queryVariables,
              });
              data.partnership.numPendingGames--;
              proxy.writeQuery({
                query: PartnershipQuery,
                variables: queryVariables,
                data,
              });
            } catch (e) {
              // no-op
            }
          },
        });
      }
    }),
  }),
  screen
)(ResultsScreen);
