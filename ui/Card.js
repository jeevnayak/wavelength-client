import React, {
  Component,
} from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import {
  kKeyboardHeight,
} from './Keyboard';
import Letters from './Letters';

const kHorizontalMargin = 30;
const kCardHeight = 400;
const kHeaderHeight = 70;
const kClueHeight = 60;
const kBorderSize = 10;

export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottom: new Animated.Value(this.calculateBottom_(props)),
    };
  }

  componentWillReceiveProps(nextProps) {
    Animated.spring(this.state.bottom, {
      toValue: this.calculateBottom_(nextProps),
      friction: 7,
    }).start();
  }

  render() {
    const style = {transform: [{translateY: this.state.bottom}]};
    return <Animated.View style={[Styles.Card, style]}>
      <Header word={this.props.word} />
      <Clues
        clues={this.props.clues}
        focusedIndex={this.props.focusedClueIndex} />
    </Animated.View>;
  }

  calculateBottom_(props) {
    const cluesContainerHeight = kCardHeight - kHeaderHeight - kBorderSize;
    const cluesHeight = kClueHeight * 4;
    const cluesPadding = (cluesContainerHeight - cluesHeight) / 2;
    const focusedClueBottom =
      kHeaderHeight + cluesPadding + kClueHeight * (props.focusedClueIndex + 1);
    return -(kKeyboardHeight - kCardHeight + focusedClueBottom);
  }
}

const Header = (props) => (
  <View style={Styles.Header}>
    <Letters text={props.word} color="#fff" />
  </View>
);

const Clues = (props) => {
  const clues = [0, 1, 2, 3].map((i) => {
    return <Clue
      key={i}
      text={props.clues[i]}
      focused={i === props.focusedIndex} />;
  });
  return <View style={Styles.Clues}>
    {clues}
  </View>
};

const Clue = (props) => {
  const blank = props.focused ? <View style={Styles.Blank} /> : null;
  return <View style={Styles.Clue}>
    <Letters text={props.text} />
    {blank}
  </View>
};

const Styles = StyleSheet.create({
  Card: {
    position: "absolute",
    bottom: 0,
    right: kHorizontalMargin,
    left: kHorizontalMargin,
    height: kCardHeight,
    paddingRight: kBorderSize,
    paddingBottom: kBorderSize,
    paddingLeft: kBorderSize,
    backgroundColor: "#300095",
    borderRadius: 12,
  },
  Header: {
    height: kHeaderHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  Clues: {
    flex: 1,
    justifyContent: "center",
    padding: 35,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  Clue: {
    height: kClueHeight,
    justifyContent: "center",
  },
  Blank: {
    height: 2,
    backgroundColor: "#300095",
    opacity: 0.2,
  }
});
