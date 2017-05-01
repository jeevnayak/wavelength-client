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
    const placeholderMargin = this.props.size / 8;
    if (this.props.value === kLetterPlaceholder) {
      style.marginRight = placeholderMargin;
    }
    if (this.props.isFirstPlaceholder) {
      style.marginLeft = placeholderMargin;
    }
    return <BoldAnimatedText style={style}>
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
    height: props.size * 1.5,
  };
  return <View style={[Styles.Letters, style]}>{letters}</View>;
}

const Styles = StyleSheet.create({
  Letters: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
