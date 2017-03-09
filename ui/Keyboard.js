import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import touchable from './Touchable';

const kLetterRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const kMaxNumLetters = Math.max(...kLetterRows.map((row) => row.length));
const kWindowWidth = Dimensions.get("window").width;
const kKeySpacing = 5;
const kKeyWidth =
  (kWindowWidth - (kMaxNumLetters + 1) * kKeySpacing) / kMaxNumLetters;
const kRowSpacing = 10;

export default Keyboard = (props) => {
  const letterRows = kLetterRows.map((letters, i) => {
    const letterRow = <LetterRow
      key={i}
      firstRow={i === 0}
      letters={letters}
      onPressLetter={(letter) => props.onPressLetter(letter)} />;
    if (i === 2) {
      return <View key={i} style={Styles.HorizontalLayout}>
        {letterRow}
        <Key
          style={Styles.BackspaceKey}
          firstKey={false}
          text="<"
          onPress={props.onPressBackspace} />
      </View>;
    } else {
      return letterRow;
    }
  });
  return <View>
    {letterRows}
    <View style={Styles.Row}>
      <Key
        style={Styles.SubmitKey}
        firstKey={true}
        text="Submit"
        onPress={props.onPressSubmit} />
    </View>
  </View>;
};

const LetterRow = (props) => {
  return <View style={[
      Styles.Row,
      props.firstRow ? Styles.FirstRow : null]}>
    {props.letters.map((letter, i) => <Key
      key={i}
      firstKey={i === 0}
      text={letter}
      onPress={() => props.onPressLetter(letter)} />)}
  </View>
};

const Key = touchable((props) => (
  <View style={[
      Styles.Key,
      props.firstKey ? Styles.FirstKey : null,
      props.touchableActive ? Styles.KeyActive : null,
      props.style]}>
    <Text>{props.text}</Text>
  </View>
));

const Styles = StyleSheet.create({
  HorizontalLayout: {
    flexDirection: "row",
  },
  Row: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: kRowSpacing,
  },
  FirstRow: {
    marginTop: 0,
  },
  Key: {
    alignItems: "center",
    justifyContent: "center",
    width: kKeyWidth,
    height: kKeyWidth * 3 / 2,
    marginLeft: kKeySpacing,
    backgroundColor: "#0ff",
  },
  FirstKey: {
    marginLeft: 0,
  },
  KeyActive: {
    backgroundColor: "#00f",
  },
  BackspaceKey: {
    position: "absolute",
    top: kRowSpacing,
    right: 0,
  },
  SubmitKey: {
    width: 200,
  },
});
