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

export const kLetterPlaceholder = "\u2022";

class Letter extends Component {
  state = {
    scale: new Animated.Value(0),
  };

  componentDidMount() {
    this.animate_();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value === kLetterPlaceholder &&
        this.props.value !== kLetterPlaceholder) {
      this.animate_();
    }
  }

  render() {
    const style = {
      fontSize: this.props.size,
      color: this.props.color,
      transform: [{scale: this.state.scale}],
    };
    return <BoldAnimatedText style={[
        this.props.value === kLetterPlaceholder && Styles.PlaceholderLetter,
        this.props.isFirstPlaceholder && Styles.FirstPlaceholderLetter,
        style]}>
      {this.props.value}
    </BoldAnimatedText>;
  }

  animate_() {
    this.state.scale.setValue(0);
    Animated.spring(this.state.scale, {
      toValue: 1,
      friction: 6,
    }).start();
  }
}

export default Letters = (props) => {
  let seenPlaceholderLetter = false;
  const letters = props.text ? props.text.split("").map((letter, i) => {
    let isFirstPlaceholder = false;
    if (!seenPlaceholderLetter && letter === kLetterPlaceholder) {
      isFirstPlaceholder = true;
      seenPlaceholderLetter = true;
    }
    return <Letter
      key={i}
      value={letter}
      size={props.size}
      color={props.color}
      isFirstPlaceholder={isFirstPlaceholder} />
  }) : null;
  const style = {
    height: props.size + 10,
  };
  return <View style={[Styles.Letters, style]}>{letters}</View>;
}

const Styles = StyleSheet.create({
  PlaceholderLetter: {
    marginRight: 4,
  },
  FirstPlaceholderLetter: {
    marginLeft: 4,
  },
  Letters: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
