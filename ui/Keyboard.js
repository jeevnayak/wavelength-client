import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BackspaceIcon from '../icons/Backspace';
import Colors from './Colors';
import {
  BoldText,
} from './Text';
import touchable from './Touchable';

const kLetterRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const kMaxNumLetters = Math.max(...kLetterRows.map((row) => row.length));
const kWindowWidth = Dimensions.get("window").width;
const kKeyHorizontalSpacing = 8;
const kKeyVerticalSpacing = 10;
const kKeyWidth =
  (kWindowWidth - kMaxNumLetters * kKeyHorizontalSpacing) /
  kMaxNumLetters;
const kKeyHeight = kKeyWidth * 4 / 3;

export const kKeyboardHeight = 4 * (kKeyHeight + kKeyVerticalSpacing);

export default Keyboard = (props) => {
  const letterRows = kLetterRows.map((letters, i) => {
    const letterRow = <LetterRow
      key={i}
      letters={letters}
      onPressLetter={(letter) => props.onPressLetter(letter)} />;
    if (i === 2) {
      return <View key={i} style={Styles.HorizontalLayout}>
        {letterRow}
        <View style={Styles.BackspaceContainer}>
          <Key style={Styles.BackspaceKey} onPress={props.onPressBackspace}>
            <BackspaceIcon size={16} />
          </Key>
        </View>
      </View>;
    } else {
      return letterRow;
    }
  });
  let skipKey;
  if (props.onPressSkip) {
    skipKey = <SkipKey onPress={props.onPressSkip} />
  }
  return <View style={Styles.Keyboard}>
    {letterRows}
    <View style={[Styles.Row, skipKey ? Styles.SkipRow : Styles.SubmitRow]}>
      {skipKey}
      <SubmitKey text={props.submitButtonText} onPress={props.onPressSubmit} />
    </View>
  </View>;
};

const LetterRow = (props) => {
  return <View style={Styles.Row}>
    {props.letters.map((letter, i) => <Key
      key={i}
      text={letter}
      onPress={() => props.onPressLetter(letter)} />)}
  </View>
};

const Key = touchable((props) => (
  <View style={[
      Styles.Key,
      props.style,
      props.touchableActive ? Styles.KeyActive : null]}>
    {props.text ?
      <Text style={Styles.KeyText}>{props.text}</Text> :
      props.children}
  </View>
));

const SubmitKey = touchable((props) => (
  <View style={[
      Styles.Key,
      Styles.SubmitKey,
      props.style,
      props.touchableActive ? Styles.KeyActive : null]}>
    <BoldText style={Styles.SubmitKeyText}>{props.text}</BoldText>
  </View>
));

const SkipKey = touchable((props) => (
  <View style={[
      Styles.Key,
      Styles.SkipKey,
      props.style,
      props.touchableActive ? Styles.KeyActive : null]}>
    <BoldText style={Styles.SkipKeyText}>SKIP</BoldText>
  </View>
));

const Styles = StyleSheet.create({
  Keyboard: {
    height: kKeyboardHeight,
    backgroundColor: "#d3d7de",
  },
  HorizontalLayout: {
    flexDirection: "row",
  },
  Row: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  Key: {
    alignItems: "center",
    justifyContent: "center",
    width: kKeyWidth,
    height: kKeyHeight,
    marginLeft: kKeyHorizontalSpacing / 2,
    marginRight: kKeyHorizontalSpacing / 2,
    marginTop: kKeyVerticalSpacing / 2,
    marginBottom: kKeyVerticalSpacing / 2,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  KeyText: {
    fontSize: 20,
  },
  KeyActive: {
    backgroundColor: "#00f",
  },
  BackspaceContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  BackspaceKey: {
    width: kKeyHeight,
    backgroundColor: "#a3aebf",
  },
  SubmitRow: {
    justifyContent: "flex-end",
  },
  SkipRow: {
    justifyContent: "space-between",
  },
  SubmitKey: {
    width: 100,
    backgroundColor: Colors.Primary,
  },
  SubmitKeyText: {
    fontSize: 20,
    color: "#fff",
  },
  SkipKey: {
    width: 100,
    backgroundColor: "#a3aebf",
  },
  SkipKeyText: {
    fontSize: 20,
  },
});
