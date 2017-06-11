import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  CenteredMediumText,
} from './Text';
import touchable from './Touchable';

export const Button = touchable((props) => (
  <CenteredMediumText style={[
      Styles.Button,
      props.touchableActive ? Styles.ButtonActive : null,
      props.style]}>
    {props.text}
  </CenteredMediumText>
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
  },
  ButtonActive: {
    backgroundColor: "#f00",
  },
  Back: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
