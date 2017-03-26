import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';

import {
  BackButton,
} from '../ui/Button';
import Card from '../ui/Card';
import GameQuery from '../queries/GameQuery';
import Keyboard from '../ui/Keyboard';
import {
  screen,
  Screen,
} from '../ui/Screen';

class GiveCluesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clues: [""],
    };
  }

  render() {
    return (
      <Screen>
        <BackButton navigator={this.props.navigator} />
        <Card
          word={this.props.game.word}
          clues={this.state.clues} />
        <Keyboard
          onPressLetter={(letter) => this.onPressLetter_(letter)}
          onPressBackspace={() => this.onPressBackspace_()}
          onPressSubmit={() => this.onPressSubmit_()} />
      </Screen>
    );
  }

  onPressLetter_(letter) {
    this.state.clues[this.state.clues.length - 1] += letter;
    this.setState({clues: this.state.clues});
  }

  onPressBackspace_() {
    let currentClue = this.state.clues[this.state.clues.length - 1];
    currentClue = currentClue.substring(0, currentClue.length - 1);
    this.state.clues[this.state.clues.length - 1] = currentClue;
    this.setState({clues: this.state.clues});
  }

  onPressSubmit_() {
    if (this.state.clues.length === 4) {
      this.giveClues_();
    } else {
      this.setState({clues: [...this.state.clues, ""]});
    }
  }

  async giveClues_() {
    await this.props.giveClues(this.state.clues);
    this.props.navigator.pop();
  }
}

const giveCluesMutation = gql`
  mutation giveClues($currentUserId: String!, $gameId: Int!, $clues: [String]!) {
    giveClues(gameId: $gameId, clues: $clues) {
      id
      word
      isCluer(userId: $currentUserId)
      clues
      guesses
      replayed
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
          }
        });
      }
    }),
  }),
  screen
)(GiveCluesScreen);
