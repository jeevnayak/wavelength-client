import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Letters from './Letters';

const kHorizontalMargin = 30;
const kHeight = 500;
const kHeaderHeight = 70;
const kBorderSize = 10;

export default Card = (props) => {
  return <View style={Styles.Card}>
    <Header word={props.word} />
    <Clues clues={props.clues} />
  </View>;
};

const Header = (props) => (
  <View style={Styles.Header}>
    <Letters text={props.word} color="#fff" />
  </View>
);

const Clues = (props) => (
  <View style={Styles.Clues}>
    <Letters text={props.clues[0]} />
    <Letters text={props.clues[1]} />
    <Letters text={props.clues[2]} />
    <Letters text={props.clues[3]} />
  </View>
);

const Styles = StyleSheet.create({
  Card: {
    position: "absolute",
    top: 100,
    right: kHorizontalMargin,
    left: kHorizontalMargin,
    height: kHeight,
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
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});
