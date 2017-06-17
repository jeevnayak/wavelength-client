import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ExitIcon from '../icons/Exit';
import {
  CenteredMediumText,
} from './Text';
import touchable from './Touchable';

export const Button = touchable((props) => (
  props.text ?
    <CenteredMediumText style={[
        Styles.Button,
        props.touchableActive ? Styles.ButtonActive : null,
        props.style]}>
      {props.text}
    </CenteredMediumText> :
    <View {...props} style={[
        Styles.Button,
        props.touchableActive ? Styles.ButtonActive : null,
        props.style]} />
));

export const BackButton = (props) => (
  <View style={Styles.BackContainer}>
    <Button
      style={Styles.BackButton}
      text="Back"
      onPress={props.navigator.pop} />
  </View>
);

export const ExitButton = (props) => (
  <View style={Styles.ExitContainer}>
    <Button style={Styles.ExitButton} onPress={props.navigator.pop}>
      <ExitIcon size={24} />
    </Button>
  </View>
);

const Styles = StyleSheet.create({
  Button: {
    height: 64,
  },
  ButtonActive: {
    backgroundColor: "#f00",
  },
  BackContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  BackButton: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  ExitContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  ExitButton: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
});
