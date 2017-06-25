import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import BackIcon from '../icons/Back';
import Colors from './Colors';
import ExitIcon from '../icons/Exit';
import Sizes from './Sizes';
import {
  CenteredMediumText,
  BoldText,
} from './Text';

export const Button = (props) => (
  <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
    {props.text ?
      <CenteredMediumText style={[Styles.Button, props.style]}>
        {props.text}
      </CenteredMediumText> :
      <View {...props} style={[Styles.Button, props.style]} />}
  </TouchableOpacity>
);

export const BackButton = (props) => (
  <View style={Styles.BackContainer}>
    <Button style={Styles.BackButton} onPress={props.navigator.pop}>
      <BackIcon size={20} />
    </Button>
  </View>
);

export const ExitButton = (props) => (
  <View style={Styles.ExitContainer}>
    <Button style={Styles.ExitButton} onPress={props.navigator.pop}>
      <ExitIcon size={20} />
    </Button>
  </View>
);

export const PrimaryButton = (props) => (
  <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
    <View style={[Styles.PrimaryButton, props.style]}>
      <BoldText style={Styles.PrimaryButtonText}>
        {props.text}
      </BoldText>
    </View>
  </TouchableOpacity>
);

const Styles = StyleSheet.create({
  Button: {
    height: 64,
  },
  BackContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  BackButton: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  ExitContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  ExitButton: {
    width: 72,
    height: 72,
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  PrimaryButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: Colors.Primary,
    borderRadius: 12,
  },
  PrimaryButtonText: {
    fontSize: Sizes.Text,
    color: "#fff",
  },
});
