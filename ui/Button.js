import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import touchable from './Touchable';

export const Button = touchable((props) => (
  <Text style={[
      Styles.Button,
      props.touchableActive ? Styles.ButtonActive : null,
      props.style]}>
    {props.text}
  </Text>
));

export const BackButton = (props) => (
  <Button
    onPress={props.navigator.pop}
    style={[Styles.Back, props.style]}
    text="Back" />
);

const Styles = StyleSheet.create({
  Button: {
    height: 64,
    textAlign: "center",
    lineHeight: 64,
  },
  ButtonActive: {
    backgroundColor: "#f00",
  },
  Back: {
    textAlign: "left",
    paddingLeft: 16,
  },
});
