import React from 'react';
import {
  StyleSheet,
  View,
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
  <View style={Styles.BackContainer}>
    <Button
      style={Styles.BackButton}
      text="Back"
      onPress={props.navigator.pop} />
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
});
