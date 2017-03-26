import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Letters from './Letters';

export default Card = (props) => (
  <View style={Styles.Card}>
    <Header word={props.word} />
    <Clues clues={props.clues} />
  </View>
);

const Header = (props) => (
  <View style={Styles.Header}>
    <Letters text={props.word} />
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
    flex: 1,
  },
  Header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0e0",
  },
  Clues: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
