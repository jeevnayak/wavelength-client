import React, {
  Component,
} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

import Colors from './Colors';
import {
  kKeyboardHeight,
} from './Keyboard';
import Letters, {
  kLetterPlaceholder,
} from './Letters';

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
    if (props.activeIndex !== undefined) {
      const headerHeight = headerHeightFromWidth(width);
      const borderSize = borderSizeFromWidth(width);
      const clueHeight = clueHeightFromWidth(width);
      const cluesContainerHeight = height - headerHeight - borderSize;
      const cluesHeight = clueHeight * 4;
      const cluesPadding = (cluesContainerHeight - cluesHeight) / 2;
      const activeClueBottom = headerHeight + cluesPadding +
        clueHeight * (props.activeIndex + 1);
      return -(kKeyboardHeight - height + activeClueBottom);
    } else {
      return -(kWindowHeight - height) / 2;
    }
  }
}

export class Card extends Component {
  render() {
    const guessingWord = this.guessingWord_();
    const {word, clues, guesses, ...props} = this.props;
    props.word = guessingWord && !props.forceShowWord ?
      this.getDisplayGuess_() : word;
    if (guesses) {
      props.clues = clues.map((clue, i) => ({
        text: guessingWord || i !== props.activeIndex ?
          clue : this.getDisplayGuess_(),
        correct: i === this.correctGuessIndex_(),
        wavelengthIncorrect: this.wavelengthIncorrect_(clue, i),
        wavelengthCorrect: this.wavelengthCorrect_(clue, i),
      }));
    } else if (clues) {
      props.clues = clues.map((clue, i) => ({
        text: clue,
        needsBlank: !this.props.guesses && i === props.activeIndex,
      }));
    }
    return <CardView
      incorrect={this.correctGuessIndex_() === -1}
      {...props} />;
  }

  correctGuessIndex_() {
    if (this.props.guesses) {
      const correctIndex = this.props.guesses.indexOf(this.props.word);
      return correctIndex === this.props.activeIndex ? -1 : correctIndex;
    } else {
      return -1;
    }
  }

  guessingWord_() {
    return this.correctGuessIndex_() === -1;
  }

  wavelengthIncorrect_(clue, i) {
    const correctGuessIndex = this.correctGuessIndex_();
    if (correctGuessIndex === -1) {
      return false;
    }
    return i > correctGuessIndex && i !== this.props.activeIndex &&
      clue !== this.props.guesses[i];
  }

  wavelengthCorrect_(clue, i) {
    const correctGuessIndex = this.correctGuessIndex_();
    if (correctGuessIndex === -1) {
      return false;
    }
    return i > correctGuessIndex && i !== this.props.activeIndex &&
      clue === this.props.guesses[i];
  }

  getCurrentGuess_() {
    return this.props.guesses[this.props.activeIndex];
  }

  getCurrentTarget_() {
    return this.guessingWord_() ?
      this.props.word : this.props.clues[this.props.activeIndex];
  }

  getDisplayGuess_() {
    const currentGuess = this.getCurrentGuess_() || "";
    return currentGuess + kLetterPlaceholder.repeat(
        this.getCurrentTarget_().length - currentGuess.length);
  }
}

const CardView = (props) => {
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
      style={[Styles.Card, props.incorrect && Styles.IncorrectCard, style]}>
    <Header
      word={props.word}
      height={headerHeightFromWidth(props.width)}
      textSize={headerTextSizeFromWidth(props.width)} />
    <Clues
      thumbnail={props.thumbnail}
      clues={props.clues}
      clueHeight={clueHeightFromWidth(props.width)}
      clueTextSize={clueTextSizeFromWidth(props.width)}
      borderRadius={innerBorderRadiusFromWidth(props.width)}
      activeIndex={props.activeIndex} />
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
  if (props.thumbnail) {
    // TODO(rajeev): show stars
  } else {
    clues = [0, 1, 2, 3].map((i) => (
      <Clue
        key={i}
        clue={props.clues[i]}
        height={props.clueHeight}
        textSize={props.clueTextSize} />
    ));
  }
  const style = {borderRadius: props.borderRadius};
  return <View style={[Styles.Clues, style]}>
    {clues}
  </View>;
};

const Clue = (props) => {
  const blank = props.clue && props.clue.needsBlank ?
    <View style={Styles.Blank} /> : null;
  const style = {height: props.height};
  let color;
  if (props.clue) {
    if (props.clue.correct) {
      color = Colors.Primary;
    } else if (props.clue.wavelengthIncorrect) {
      color = Colors.Incorrect;
    } else if (props.clue.wavelengthCorrect) {
      color = Colors.Wavelength;
    }
  }
  return <View style={[Styles.Clue, style]}>
    <Letters
      text={props.clue ? props.clue.text : ""}
      size={props.textSize}
      color={color} />
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
    backgroundColor: Colors.Primary,
  },
  IncorrectCard: {
    backgroundColor: Colors.Incorrect,
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
    backgroundColor: Colors.Primary,
    opacity: 0.2,
  },
});
