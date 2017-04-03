import React, {
  Component,
} from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import {
  BoldAnimatedText,
} from './Text';

class Letter extends Component {
  state = {
    scale: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.spring(this.state.scale, {
      toValue: 1,
      friction: 6,
    }).start();
  }

  render() {
    const style = {
      fontSize: this.props.size,
      color: this.props.color,
      transform: [{scale: this.state.scale}],
    };
    return <BoldAnimatedText style={style}>
      {this.props.value}
    </BoldAnimatedText>;
  }
}

export default Letters = (props) => {
  const letters = props.text ? props.text.split("").map((letter, i) => (
    <Letter key={i} value={letter} size={props.size} color={props.color} />
  )) : null;
  const style = {
    height: props.size + 10,
  };
  return <View style={[Styles.Letters, style]}>{letters}</View>;
}

const Styles = StyleSheet.create({
  Letters: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
