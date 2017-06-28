import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  StyleSheet,
} from 'react-native';

import {
  ExitButton,
} from '../ui/Button';
import {
  FullScreenCard,
} from '../ui/Card';
import GameQuery from '../queries/GameQuery';
import Keyboard from '../ui/Keyboard';
import {
  Event,
  logEvent,
} from '../util/Logging';
import PartnershipQuery from '../queries/PartnershipQuery';
import {
  screen,
  Screen,
} from '../ui/Screen';

class GiveCluesScreen extends Component {
  state = {
    editingClueIndex: 0,
    clues: [""],
  };

  componentDidMount() {
    logEvent(Event.StartGiveClues, {
      gameId: this.props.game.id,
      partnershipId: this.props.game.partnership.id,
      partnerId: this.props.game.partnership.partner.id,
    });
  }

  render() {
    return <Screen style={Styles.Screen}>
      <ExitButton navigator={this.props.navigator} />
      <FullScreenCard
        instructionText="GIVE CLUES"
        word={this.props.game.word}
        clues={this.state.clues}
        activeIndex={this.state.clues.length - 1}
        editingIndex={this.state.editingClueIndex}
        onPressClue={(index) => this.onPressClue_(index)} />
      <Keyboard
        onPressLetter={(letter) => this.onPressLetter_(letter)}
        onPressBackspace={() => this.onPressBackspace_()}
        submitButtonText={this.state.editingClueIndex === 3 ? "SEND" : "NEXT"}
        onPressSubmit={() => this.onPressSubmit_()} />
    </Screen>;
  }

  onPressClue_(index) {
    if (index !== this.state.editingClueIndex) {
      this.setState({editingClueIndex: index});
    }
  }

  onPressLetter_(letter) {
    this.state.clues[this.state.editingClueIndex] += letter;
    this.setState({clues: this.state.clues});
  }

  onPressBackspace_() {
    let currentClue = this.state.clues[this.state.editingClueIndex];
    currentClue = currentClue.substring(0, currentClue.length - 1);
    this.state.clues[this.state.editingClueIndex] = currentClue;
    this.setState({clues: this.state.clues});
  }

  onPressSubmit_() {
    if (this.state.editingClueIndex === 3) {
      if (!this.state.clues.every((clue) => clue)) {
        return;
      }
      this.giveClues_();
    } else {
      if (!this.state.clues[this.state.editingClueIndex]) {
        return;
      }
      if (this.state.editingClueIndex === this.state.clues.length - 1) {
        this.setState({
          editingClueIndex: this.state.editingClueIndex + 1,
          clues: [...this.state.clues, ""],
        });
      } else {
        this.setState({editingClueIndex: this.state.editingClueIndex + 1});
      }
    }
  }

  async giveClues_() {
    await this.props.giveClues(this.state.clues);
    this.props.navigator.pop();
    logEvent(Event.GiveClues, {
      gameId: this.props.game.id,
      partnershipId: this.props.game.partnership.id,
      partnerId: this.props.game.partnership.partner.id,
    });
  }
}

const Styles = StyleSheet.create({
  Screen: {
    justifyContent: "flex-end",
  },
});

const giveCluesMutation = gql`
  mutation giveClues($currentUserId: String!, $gameId: Int!, $clues: [String]!) {
    giveClues(gameId: $gameId, clues: $clues) {
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
  graphql(giveCluesMutation, {
    props: ({ ownProps, mutate }) => ({
      giveClues: (clues) => {
        mutate({
          variables: {
            currentUserId: ownProps.currentUserId,
            gameId: ownProps.gameId,
            clues: clues
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
)(GiveCluesScreen);
