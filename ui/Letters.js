import React, {
  Component,
} from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

class Letter extends Component {
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

export default Letters = (props) => {
  const letters = props.text ? props.text.split("").map(
    (letter, i) => <Letter key={i} value={letter} />) : null;
  return <View style={[Styles.Letters, props.style]}>{letters}</View>;
}

const Styles = StyleSheet.create({
  Letter: {
    fontSize: 28,
  },
  Letters: {
    flexDirection: "row",
    height: 35,
  },
});
