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
    const style = {
      color: this.props.color,
      transform: [{scale: this.state.scale}],
    };
    return <Animated.Text style={[Styles.Letter, style]}>
      {this.props.value}
    </Animated.Text>;
  }
}

export default Letters = (props) => {
  const letters = props.text ? props.text.split("").map(
    (letter, i) => <Letter key={i} value={letter} color={props.color} />) :
    null;
  return <View style={[Styles.Letters, props.style]}>{letters}</View>;
}

const Styles = StyleSheet.create({
  Letter: {
    fontSize: 28,
  },
  Letters: {
    flexDirection: "row",
    justifyContent: "center",
    height: 35,
  },
});
