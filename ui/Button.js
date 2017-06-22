import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import BackIcon from '../icons/Back';
import Colors from './Colors';
import ExitIcon from '../icons/Exit';
import {
  CenteredMediumText,
  BoldText,
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
    <Button style={Styles.BackButton} onPress={props.navigator.pop}>
      <BackIcon size={16} />
    </Button>
  </View>
);

export const ExitButton = (props) => (
  <View style={Styles.ExitContainer}>
    <Button style={Styles.ExitButton} onPress={props.navigator.pop}>
      <ExitIcon size={16} />
    </Button>
  </View>
);

export const PrimaryButton = touchable((props) => (
    <View style={[
        Styles.PrimaryButton,
        props.touchableActive ? Styles.PrimaryButtonActive : null,
        props.style]}>
      <BoldText style={Styles.PrimaryButtonText}>
        {props.text}
      </BoldText>
    </View>
));

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
    width: 50,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  ExitContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  ExitButton: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  PrimaryButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: Colors.Primary,
    borderRadius: 10,
  },
  PrimaryButtonActive: {
    backgroundColor: "#f00",
  },
  PrimaryButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
