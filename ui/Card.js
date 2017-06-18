import React, {
  Component,
} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Colors from './Colors';
import {
  kKeyboardHeight,
} from './Keyboard';
import Letters, {
  kLetterPlaceholder,
} from './Letters';
import StarIcon from '../icons/Star';
import {
  InstructionText,
} from '../ui/Text';

const kWindowWidth = Dimensions.get("window").width;
const kWindowHeight = Dimensions.get("window").height;
const kFullScreenHorizontalMargin = 30;
const kFullScreenCardWidth = kWindowWidth - 2 * kFullScreenHorizontalMargin;

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

export function getFullScreenCardBottom() {
  const height = heightFromWidth(kFullScreenCardWidth);
  return -(kWindowHeight - height) / 2;
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
    let instructionText;
    if (this.props.instructionText) {
      instructionText = <InstructionText style={Styles.InstructionText}>
        {this.props.instructionText.toUpperCase()}
      </InstructionText>;
    }
    const style = {transform: [{translateY: this.state.bottom}]};
    return <Animated.View style={[Styles.FullScreenCard, style]}>
      {instructionText}
      <Card width={kFullScreenCardWidth} {...this.props} />
    </Animated.View>;
  }

  calculateBottom_(props) {
    const width = kFullScreenCardWidth;
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
        needsBlank: !this.props.guesses && i === props.editingIndex,
      }));
    }
    return <CardView
      incorrect={this.correctGuessIndex_() === -1}
      {...props} />;
  }

  correctGuessIndex_() {
    if (this.props.forceCorrect) {
      return 0;
    } else if (this.props.guesses) {
      const correctIndex = this.props.guesses.indexOf(this.props.word);
      return correctIndex === this.props.activeIndex ? -1 : correctIndex;
    } else {
      return -1;
    }
  }

  guessingWord_() {
    return this.props.guesses && this.correctGuessIndex_() === -1;
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
    const targetParts = this.getCurrentTarget_().split(" ");
    let currentGuess = this.getCurrentGuess_() || "";
    let displayGuessParts = [];
    for (const targetPart of targetParts) {
      const guessPart = currentGuess.substring(0, targetPart.length);
      displayGuessParts.push(guessPart + kLetterPlaceholder.repeat(
        Math.max(targetPart.length - guessPart.length, 0)));
      currentGuess = currentGuess.substring(targetPart.length);
    }
    return displayGuessParts.join(" ");
  }
}

export const CardView = (props) => {
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
      customContents={props.customContents}
      thumbnail={props.thumbnail}
      clues={props.clues}
      clueHeight={clueHeightFromWidth(props.width)}
      clueTextSize={clueTextSizeFromWidth(props.width)}
      borderRadius={innerBorderRadiusFromWidth(props.width)}
      onPressClue={props.onPressClue} />
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
  let contents;
  if (props.customContents) {
    contents = props.customContents;
  } else if (props.thumbnail) {
    contents = [0, 1, 2, 3].map((i) => {
      if (props.clues[i] && props.clues[i].wavelengthCorrect) {
        const style = {
          marginTop: props.clueHeight / 4,
          marginBottom: props.clueHeight / 4,
        };
        return <View key={i} style={style}>
          <StarIcon size={props.clueHeight} />
        </View>;
      } else {
        return null;
      }
    });
  } else {
    contents = [0, 1, 2, 3].map((i) => (
      <Clue
        key={i}
        clue={props.clues[i]}
        height={props.clueHeight}
        textSize={props.clueTextSize}
        onPress={props.onPressClue ? () => props.onPressClue(i) : null} />
    ));
  }
  const style = {borderRadius: props.borderRadius};
  return <View style={[
      Styles.Clues,
      props.thumbnail && Styles.CluesThumbnail,
      style]}>
    {contents}
  </View>;
};

const Clue = (props) => {
  let blank;
  if (props.clue && props.clue.needsBlank) {
    blank = <View style={Styles.Blank} />;
  }
  let star;
  if (props.clue && props.clue.wavelengthCorrect) {
    star = <View style={[Styles.Star, {top: props.textSize * 0.05}]}>
      <StarIcon size={props.textSize * 1.25} />
    </View>;
  }
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
  const view = <View style={[Styles.Clue, style]}>
    <View>
      {star}
      <Letters
        text={props.clue ? props.clue.text : ""}
        size={props.textSize}
        color={color} />
    </View>
    {blank}
  </View>;
  if (props.onPress) {
    return <TouchableWithoutFeedback onPress={props.onPress}>
      {view}
    </TouchableWithoutFeedback>;
  } else {
    return view;
  }
};

const Styles = StyleSheet.create({
  InstructionText: {
    marginBottom: 25,
  },
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
  CluesThumbnail: {
    alignItems: "center",
  },
  Clue: {
    justifyContent: "center",
    paddingLeft: 35,
    paddingRight: 35,
  },
  Star: {
    position: "absolute",
    left: 0,
  },
  Blank: {
    height: 2,
    marginTop: 5,
    backgroundColor: Colors.Primary,
    opacity: 0.2,
  },
});
