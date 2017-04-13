import React, {
  Component,
} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

import {
  kKeyboardHeight,
} from './Keyboard';
import Letters from './Letters';

const kWindowWidth = Dimensions.get("window").width;
const kWindowHeight = Dimensions.get("window").height;
const kFullScreenHorizontalMargin = 30;

function heightFromWidth(width) {
  return width * 1.5;
}

function headerHeightFromWidth(width) {
  return width * 0.22;
}

function headerTextSizeFromWidth(width) {
  return width * 0.1;
}

function clueHeightFromWidth(width) {
  return width * 0.25;
}

function clueTextSizeFromWidth(width) {
  return width * 0.08;
}

function borderSizeFromWidth(width) {
  return width * 0.03;
}

function borderRadiusFromWidth(width) {
  return width * 0.04;
}

function innerBorderRadiusFromWidth(width) {
  return width * 0.01;
}

export class FullScreenCard extends Component {
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
    return <Animated.View style={[Styles.FullScreenCard, style]}>
      <Card width={this.width_()} {...this.props} />
    </Animated.View>;
  }

  width_() {
    return kWindowWidth - 2 * kFullScreenHorizontalMargin;
  }

  calculateBottom_(props) {
    const width = this.width_();
    const height = heightFromWidth(width);
    if (props.focusedClueIndex !== undefined) {
      const headerHeight = headerHeightFromWidth(width);
      const borderSize = borderSizeFromWidth(width);
      const clueHeight = clueHeightFromWidth(width);
      const cluesContainerHeight = height - headerHeight - borderSize;
      const cluesHeight = clueHeight * 4;
      const cluesPadding = (cluesContainerHeight - cluesHeight) / 2;
      const focusedClueBottom = headerHeight + cluesPadding +
        clueHeight * (props.focusedClueIndex + 1);
      return -(kKeyboardHeight - height + focusedClueBottom);
    } else {
      return -(kWindowHeight - height) / 2;
    }
  }
}

export const Card = (props) => {
  const borderSize = borderSizeFromWidth(props.width);
  const style = {
    width: props.width,
    height: heightFromWidth(props.width),
    paddingRight: borderSize,
    paddingBottom: borderSize,
    paddingLeft: borderSize,
    borderRadius: borderRadiusFromWidth(props.width),
  };
  return <View
      style={[Styles.Card, props.guessingWord && Styles.PendingCard, style]}>
    <Header
      word={props.word}
      height={headerHeightFromWidth(props.width)}
      textSize={headerTextSizeFromWidth(props.width)} />
    <Clues
      clues={props.clues}
      clueHeight={clueHeightFromWidth(props.width)}
      clueTextSize={clueTextSizeFromWidth(props.width)}
      borderRadius={innerBorderRadiusFromWidth(props.width)}
      focusedIndex={props.focusedClueIndex} />
  </View>;
}

const Header = (props) => {
  const style = {height: props.height};
  return <View style={[Styles.Header, style]}>
    <Letters
      text={props.word}
      size={props.textSize}
      color="#fff" />
  </View>;
};

const Clues = (props) => {
  let clues;
  if (props.clues) {
    clues = [0, 1, 2, 3].map((i) => (
      <Clue
        key={i}
        text={props.clues[i]}
        height={props.clueHeight}
        textSize={props.clueTextSize}
        focused={i === props.focusedIndex} />
    ));
  }
  const style = {borderRadius: props.borderRadius};
  return <View style={[Styles.Clues, style]}>
    {clues}
  </View>;
};

const Clue = (props) => {
  const blank = props.focused ? <View style={Styles.Blank} /> : null;
  const style = {height: props.height};
  return <View style={[Styles.Clue, style]}>
    <Letters text={props.text} size={props.textSize} />
    {blank}
  </View>
};

const Styles = StyleSheet.create({
  FullScreenCard: {
    position: "absolute",
    bottom: 0,
    left: kFullScreenHorizontalMargin,
  },
  Card: {
    backgroundColor: "#300095",
  },
  PendingCard: {
    backgroundColor: "#666",
  },
  Header: {
    justifyContent: "center",
    alignItems: "center",
  },
  Clues: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  Clue: {
    justifyContent: "center",
    paddingLeft: 35,
    paddingRight: 35,
  },
  Blank: {
    height: 2,
    marginTop: 5,
    backgroundColor: "#300095",
    opacity: 0.2,
  }
});
