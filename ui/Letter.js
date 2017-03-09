import React, {
  Component,
} from 'react';
import {
  Animated,
  StyleSheet,
} from 'react-native';

export default class Letter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.scale, {
      toValue: 0.8,
      friction: 4,
    }).start();
  }

  render() {
    const style = {transform: [{scale: this.state.scale}]};
    return <Animated.Text style={[Styles.Letter, style]}>
      {this.props.value}
    </Animated.Text>;
  }
}

const Styles = StyleSheet.create({
  Letter: {
    fontSize: 28,
  },
});
