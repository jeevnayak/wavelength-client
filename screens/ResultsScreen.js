import React, {
  Component,
} from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Screen,
} from '../ui/Elements';

export default class ResultsScreen extends Component {
  render() {
    return (
      <Screen>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Back</Text>
        </TouchableHighlight>
        <Text>{this.props.game.word}</Text>
        <Text>Clues:</Text>
        <Text>{this.props.game.clues.join(", ")}</Text>
        <Text>Guesses:</Text>
        <Text>{this.props.game.guesses.join(", ")}</Text>
      </Screen>
    );
  }
}
